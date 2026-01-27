import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiShoppingCart, FiChevronDown, FiLoader } from 'react-icons/fi';
import { useCart, useTracking, useAuth } from '../hooks';
import { formatPrice, debounce } from '../utils/helpers';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { addressService } from '../services/addressService';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ tên'),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  address: z.string().min(10, 'Vui lòng nhập địa chỉ đầy đủ'),
  provinceId: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  districtId: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  wardId: z.string().min(1, 'Vui lòng chọn phường/xã'),
  note: z.string().optional(),
});

// Vietnam Address API Helper Functions
const VIETNAM_ADDRESS_API = 'https://provinces.open-api.vn/api';

const fetchProvinces = async () => {
  try {
    const response = await fetch(`${VIETNAM_ADDRESS_API}/p/`);
    if (!response.ok) throw new Error('Failed to fetch provinces');
    return await response.json();
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw error;
  }
};

const fetchDistricts = async (provinceCode) => {
  try {
    const response = await fetch(`${VIETNAM_ADDRESS_API}/p/${provinceCode}?depth=2`);
    if (!response.ok) throw new Error('Failed to fetch districts');
    const data = await response.json();
    return data.districts || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

const fetchWards = async (districtCode) => {
  try {
    const response = await fetch(`${VIETNAM_ADDRESS_API}/d/${districtCode}?depth=2`);
    if (!response.ok) throw new Error('Failed to fetch wards');
    const data = await response.json();
    return data.wards || [];
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
};

// Checkout steps component
const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Giỏ hàng', icon: FiShoppingCart },
    { id: 2, name: 'Thông tin đặt hàng', icon: FiShoppingCart },
    { id: 3, name: 'Hoàn tất', icon: FiShoppingCart },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step.id <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400'
                }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`font-medium ${step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-24 h-0.5 mx-4`}
              style={{
                borderStyle: 'dashed',
                borderWidth: '1px',
                borderColor: step.id < currentStep ? '#2563eb' : '#e5e7eb',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, total: cartTotal, clearCart } = useCart();
  const { identifyLead } = useTracking();
  const { isAuthenticated, user: authUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(false);

  // Vietnam Address States
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const [selectedWardCode, setSelectedWardCode] = useState('');

  // Kiểm tra xem có phải mua ngay hay không
  const buyNowItem = location.state?.buyNowItem;
  const isBuyNow = !!buyNowItem;

  // Sử dụng sản phẩm mua ngay hoặc giỏ hàng
  const items = isBuyNow ? [buyNowItem] : cartItems;
  const total = isBuyNow ? buyNowItem.price * buyNowItem.quantity : cartTotal;

  // Fetch provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const data = await fetchProvinces();
        setProvinces(data);
      } catch (error) {
        toast.error('Không thể tải danh sách tỉnh/thành phố');
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // Fetch districts when province is selected
  useEffect(() => {
    const loadDistricts = async () => {
      if (!selectedProvinceCode) {
        setDistricts([]);
        setWards([]);
        setSelectedDistrictCode('');
        setSelectedWardCode('');
        return;
      }

      try {
        setLoadingDistricts(true);
        const data = await fetchDistricts(selectedProvinceCode);
        setDistricts(data);
        setWards([]);
        setSelectedDistrictCode('');
        setSelectedWardCode('');
      } catch (error) {
        toast.error('Không thể tải danh sách quận/huyện');
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };
    loadDistricts();
  }, [selectedProvinceCode]);

  // Fetch wards when district is selected
  useEffect(() => {
    const loadWards = async () => {
      if (!selectedDistrictCode) {
        setWards([]);
        setSelectedWardCode('');
        return;
      }

      try {
        setLoadingWards(true);
        const data = await fetchWards(selectedDistrictCode);
        setWards(data);
        setSelectedWardCode('');
      } catch (error) {
        toast.error('Không thể tải danh sách phường/xã');
        setWards([]);
      } finally {
        setLoadingWards(false);
      }
    };
    loadWards();
  }, [selectedDistrictCode]);

  // Tính tổng tiền sau khi áp dụng voucher
  const discount = selectedVoucher ? (selectedVoucher.discountType === 'percentage'
    ? total * (selectedVoucher.discountValue / 100)
    : selectedVoucher.discountValue) : 0;
  const finalTotal = Math.max(total - discount, 0);

  const openVoucherModal = () => {
    setVoucherModalOpen(true);
  };

  const closeVoucherModal = () => {
    setVoucherModalOpen(false);
  };

  const applyVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setVoucherModalOpen(false);
    toast.success(`Đã áp dụng voucher: ${voucher.code}`);
  };

  const removeVoucher = () => {
    setSelectedVoucher(null);
    toast.info('Đã xóa voucher');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  // Watch phone and email for tracking
  const watchPhone = watch('phone');
  const watchEmail = watch('email');
  const watchFullName = watch('fullName');

  // Use ref to store debounced function
  const debouncedIdentifyLeadRef = useRef(
    debounce((phone, email, name) => {
      if (phone || email || name) {
        identifyLead({
          phone: phone || null,
          email: email || null,
          name: name || null
        });
      }
    }, 1000) // Wait 1 second after user stops typing
  );

  // Track phone/email changes
  useEffect(() => {
    if (watchPhone || watchEmail || watchFullName) {
      debouncedIdentifyLeadRef.current(watchPhone, watchEmail, watchFullName);
    }
  }, [watchPhone, watchEmail, watchFullName]);

  // Watch form values for cascading dropdowns
  const watchProvinceId = watch('provinceId');
  const watchDistrictId = watch('districtId');

  // Handle province change
  useEffect(() => {
    if (watchProvinceId) {
      setSelectedProvinceCode(watchProvinceId);
      setValue('districtId', '');
      setValue('wardId', '');
    } else {
      setSelectedProvinceCode('');
    }
  }, [watchProvinceId, setValue]);

  // Handle district change
  useEffect(() => {
    if (watchDistrictId) {
      setSelectedDistrictCode(watchDistrictId);
      setValue('wardId', '');
    } else {
      setSelectedDistrictCode('');
    }
  }, [watchDistrictId, setValue]);

  // Fetch user profile and default address when authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingUserData(true);

        // Fetch user profile
        const profileResponse = await userService.getProfile();
        const userProfile = profileResponse.user || profileResponse;

        // Fetch user addresses
        let defaultAddress = null;
        try {
          const addressesResponse = await addressService.getAddresses();
          if (addressesResponse.success && addressesResponse.addresses) {
            // Find default address or use first address
            defaultAddress = addressesResponse.addresses.find(addr => addr.isDefault)
              || addressesResponse.addresses[0];
          }
        } catch (error) {
          // Address service might not be available, continue without it
          console.log('Could not fetch addresses:', error);
        }

        // Auto-fill form with user data
        const formData = {
          fullName: userProfile.name || authUser?.name || '',
          phone: userProfile.phone || authUser?.phone || '',
          email: userProfile.email || authUser?.email || '',
        };

        // If we have a default address, fill address field
        if (defaultAddress) {
          formData.address = defaultAddress.addressLine1 || defaultAddress.address || '';

          // Try to match province, district, ward from address
          if (defaultAddress.city && provinces.length > 0) {
            // Normalize city name for matching (remove common suffixes)
            const normalizeName = (name) => name.toLowerCase()
              .replace(/tỉnh\s*/g, '')
              .replace(/thành phố\s*/g, '')
              .replace(/tp\.\s*/g, '')
              .trim();

            const cityName = normalizeName(defaultAddress.city);
            const matchedProvince = provinces.find(p => {
              const provinceName = normalizeName(p.name);
              return provinceName === cityName ||
                provinceName.includes(cityName) ||
                cityName.includes(provinceName);
            });

            if (matchedProvince) {
              formData.provinceId = String(matchedProvince.code);
              setSelectedProvinceCode(String(matchedProvince.code));

              // Load districts for this province
              try {
                const districtsData = await fetchDistricts(matchedProvince.code);
                setDistricts(districtsData);

                // Try to match district
                if (defaultAddress.district && districtsData.length > 0) {
                  const districtName = normalizeName(defaultAddress.district);
                  const matchedDistrict = districtsData.find(d => {
                    const dName = normalizeName(d.name);
                    return dName === districtName ||
                      dName.includes(districtName) ||
                      districtName.includes(dName);
                  });

                  if (matchedDistrict) {
                    formData.districtId = String(matchedDistrict.code);
                    setSelectedDistrictCode(String(matchedDistrict.code));

                    // Load wards for this district
                    try {
                      const wardsData = await fetchWards(matchedDistrict.code);
                      setWards(wardsData);

                      // Try to match ward
                      if (defaultAddress.ward && wardsData.length > 0) {
                        const wardName = normalizeName(defaultAddress.ward);
                        const matchedWard = wardsData.find(w => {
                          const wName = normalizeName(w.name);
                          return wName === wardName ||
                            wName.includes(wardName) ||
                            wardName.includes(wName);
                        });

                        if (matchedWard) {
                          formData.wardId = String(matchedWard.code);
                          setSelectedWardCode(String(matchedWard.code));
                        }
                      }
                    } catch (error) {
                      console.log('Could not fetch wards:', error);
                    }
                  }
                }
              } catch (error) {
                console.log('Could not fetch districts:', error);
              }
            }
          }
        }

        // Set form values
        Object.keys(formData).forEach(key => {
          if (formData[key]) {
            setValue(key, formData[key]);
          }
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        // Don't show error toast, just continue without auto-fill
      } finally {
        setLoadingUserData(false);
      }
    };

    // Only load user data if authenticated and provinces are loaded
    if (isAuthenticated && provinces.length > 0) {
      loadUserData();
    }
  }, [isAuthenticated, authUser, provinces.length, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Prepare order items for API
      const orderItems = items.map(item => ({
        productId: item.id || item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity || 1,
      }));

      // Find selected address names from codes (convert to string for comparison)
      const selectedProvince = provinces.find(p => String(p.code) === String(data.provinceId));
      const selectedDistrict = districts.find(d => String(d.code) === String(data.districtId));
      const selectedWard = wards.find(w => String(w.code) === String(data.wardId));

      // Prepare shipping address
      const shippingAddress = {
        name: data.fullName,
        phone: data.phone,
        addressLine1: data.address,
        ward: selectedWard?.name || '',
        district: selectedDistrict?.name || '',
        city: selectedProvince?.name || '',
        country: 'Vietnam',
      };

      // Calculate shipping fee (free if bank transfer, otherwise to be determined)
      const calculatedShippingFee = paymentMethod === 'bank_transfer' ? 0 : null;

      // Calculate final total
      const calculatedSubtotal = total;
      const calculatedDiscount = discount;
      const calculatedTotal = finalTotal + (calculatedShippingFee || 0);

      // Prepare order data for API
      const orderData = {
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'cod',
        guestEmail: data.email,
        couponCode: selectedVoucher?.code || null,
        discountAmount: calculatedDiscount,
        shippingFee: calculatedShippingFee,
        note: data.note || '',
      };

      // Call API to create order
      let response;
      if (!isBuyNow) {
        // Create order from cart
        response = await orderService.createOrderFromCart(orderData);
      } else {
        // Create order directly
        response = await orderService.createOrder(orderData);
      }

      if (response.success && response.order) {
        // Save address to user profile if authenticated
        if (isAuthenticated) {
          try {
            // Find selected address names from codes
            const selectedProvince = provinces.find(p => String(p.code) === String(data.provinceId));
            const selectedDistrict = districts.find(d => String(d.code) === String(data.districtId));
            const selectedWard = wards.find(w => String(w.code) === String(data.wardId));

            const addressData = {
              name: data.fullName,
              phone: data.phone,
              addressLine1: data.address,
              ward: selectedWard?.name || '',
              district: selectedDistrict?.name || '',
              city: selectedProvince?.name || '',
              country: 'Vietnam',
              isDefault: true, // Set as default address
            };

            // Check if user already has addresses
            try {
              const addressesResponse = await addressService.getAddresses();
              if (addressesResponse.success && addressesResponse.addresses) {
                // Check if this address already exists (by comparing key fields)
                const existingAddress = addressesResponse.addresses.find(addr =>
                  addr.name === addressData.name &&
                  addr.phone === addressData.phone &&
                  addr.addressLine1 === addressData.addressLine1 &&
                  addr.city === addressData.city
                );

                if (existingAddress) {
                  // Update existing address and set as default
                  await addressService.updateAddress(existingAddress._id, addressData);
                } else {
                  // Create new address
                  await addressService.createAddress(addressData);
                }
              } else {
                // No addresses yet, create first one
                await addressService.createAddress(addressData);
              }
            } catch (addressError) {
              // If address service fails, still continue with order
              console.log('Could not save address:', addressError);
            }

            // Update user profile with latest info if needed
            try {
              const profileUpdate = {};
              if (data.fullName && (!authUser?.name || authUser.name !== data.fullName)) {
                profileUpdate.name = data.fullName;
              }
              if (data.phone && (!authUser?.phone || authUser.phone !== data.phone)) {
                profileUpdate.phone = data.phone;
              }
              if (data.email && (!authUser?.email || authUser.email !== data.email)) {
                profileUpdate.email = data.email;
              }

              if (Object.keys(profileUpdate).length > 0) {
                await userService.updateProfile(profileUpdate);
              }
            } catch (profileError) {
              // If profile update fails, still continue with order
              console.log('Could not update profile:', profileError);
            }
          } catch (error) {
            // Don't block order creation if address/profile save fails
            console.error('Error saving user data:', error);
          }
        }

        // Clear cart if order created successfully
        if (!isBuyNow) {
          clearCart();
        }

        // Navigate to success page with order data
        navigate('/dat-hang-thanh-cong', {
          state: {
            order: response.order,
            orderId: response.order._id || response.order.id
          }
        });
        toast.success('Đơn hàng đã được tạo thành công!');
      } else {
        throw new Error(response.message || 'Không thể tạo đơn hàng');
      }
    } catch (error) {
      console.error('Create order error:', error);
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16 container-custom text-center bg-gray-50 min-h-screen">
        <p className="text-gray-600">
          Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.
        </p>
        <Link
          to="/san-pham"
          className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Checkout Steps */}
        <CheckoutSteps currentStep={2} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <input
                      {...register('fullName')}
                      className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      placeholder="Họ và tên *"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      {...register('phone')}
                      className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      placeholder="Số điện thoại *"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      placeholder="Email *"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-blue-900 mb-4 uppercase">
                  Địa chỉ nhận hàng
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Province */}
                    <div className="relative">
                      <select
                        {...register('provinceId')}
                        disabled={loadingProvinces}
                        className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {loadingProvinces ? 'Đang tải...' : 'Tỉnh/Thành phố *'}
                        </option>
                        {provinces.map((province) => (
                          <option key={province.code} value={province.code}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      {errors.provinceId && (
                        <p className="text-red-500 text-sm mt-1">{errors.provinceId.message}</p>
                      )}
                    </div>

                    {/* District */}
                    <div className="relative">
                      <select
                        {...register('districtId')}
                        disabled={!selectedProvinceCode || loadingDistricts}
                        className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {loadingDistricts
                            ? 'Đang tải...'
                            : !selectedProvinceCode
                              ? 'Chọn tỉnh/thành trước'
                              : 'Quận/Huyện *'}
                        </option>
                        {districts.map((district) => (
                          <option key={district.code} value={district.code}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      {errors.districtId && (
                        <p className="text-red-500 text-sm mt-1">{errors.districtId.message}</p>
                      )}
                    </div>

                    {/* Ward */}
                    <div className="relative">
                      <select
                        {...register('wardId')}
                        disabled={!selectedDistrictCode || loadingWards}
                        className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {loadingWards
                            ? 'Đang tải...'
                            : !selectedDistrictCode
                              ? 'Chọn quận/huyện trước'
                              : 'Phường/Xã *'}
                        </option>
                        {wards.map((ward) => (
                          <option key={ward.code} value={ward.code}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      {errors.wardId && (
                        <p className="text-red-500 text-sm mt-1">{errors.wardId.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <input
                      {...register('address')}
                      className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      placeholder="Số nhà, tên đường *"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  {/* Note */}
                  <div>
                    <textarea
                      {...register('note')}
                      className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 fo
                      cus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                      rows={4}
                      placeholder="Ghi chú cho người giao hàng(nếu có)"
                    />
                  </div>
                </div>
              </div>

              {/* Voucher Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-blue-900 uppercase">Voucher của bạn</h2>
                  <button
                    type="button"
                    onClick={openVoucherModal}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Chọn voucher
                  </button>
                </div>
                {selectedVoucher && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">{selectedVoucher.code}</p>
                        <p className="text-sm text-green-600">{selectedVoucher.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeVoucher}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-blue-900 mb-4 uppercase">
                  Hình thức thanh toán
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`flex flex-col gap-1 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'bank_transfer'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-semibold text-blue-700 uppercase">
                        Chuyển khoản ngân hàng
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 ml-8">
                      (FREESHIP khi chuyển khoản trước)
                    </p>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="font-medium text-gray-700 uppercase">
                      Thanh toán khi nhận hàng
                    </span>
                  </label>
                </div>
              </div>

              {/* Shipping Methods */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-blue-900 mb-4 uppercase">
                  Phương thức vận chuyển
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${shippingMethod === 'standard'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div>
                      <span className="font-medium text-gray-700">Giao hàng Tiêu chuẩn</span>
                      <p className="text-sm text-gray-500">2-3 ngày làm việc</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${shippingMethod === 'express'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div>
                      <span className="font-medium text-gray-700">Giao hàng Nhanh</span>
                      <p className="text-sm text-gray-500">1-2 ngày làm việc</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-blue-900 mb-6 uppercase italic">
                  Thông tin đơn hàng
                </h2>

                <div className="mb-4">
                  <p className="font-semibold text-gray-800 mb-4">Danh sách sản phẩm</p>

                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.variant}`}
                        className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
                      >
                        <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-red-600">
                              {formatPrice(item.price)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(item.price * 1.2)}
                            </span>
                          </div>
                          {item.variant && (
                            <div className="flex gap-1 mt-2">
                              {item.variant.split(' - ').map((v, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200"
                                >
                                  {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hình thức thanh toán</span>
                    <span className="text-blue-700 font-medium text-right">
                      {paymentMethod === 'bank_transfer'
                        ? 'Chuyển khoản ngân hàng'
                        : 'Thanh toán khi nhận hàng'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phương thức vận chuyển</span>
                    <span className="text-blue-700 font-medium text-right">
                      {shippingMethod === 'standard' ? 'Giao hàng Tiêu chuẩn' : 'Giao hàng Nhanh'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng tiền hàng</span>
                    <span className="text-red-600 font-bold">{formatPrice(total)}</span>
                  </div>

                  {selectedVoucher && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Giảm giá ({selectedVoucher.code})</span>
                      <span className="text-green-600 font-bold">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="text-blue-700 font-medium text-right">
                      {paymentMethod === 'bank_transfer' ? 'Miễn phí' : 'Nhân viên gọi trao đổi'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-gray-200 mt-4">
                  <span className="font-bold text-gray-900 uppercase">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-red-600">{formatPrice(finalTotal)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 hover:bg-blue-950 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl uppercase disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng ngay'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Voucher Modal */}
        <Modal
          open={voucherModalOpen}
          onClose={closeVoucherModal}
          title="Chọn Voucher Khuyến Mãi"
          subtitle="Áp dụng mã giảm giá cho đơn hàng của bạn"
          size="md"
          footer={
            <div className="flex justify-end">
              <button
                onClick={closeVoucherModal}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Đóng
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            {/* Voucher list with improved UI */}
            {[
              { code: 'VOUCHER10', description: 'Giảm 10% cho đơn hàng từ 500k', discountType: 'percentage', discountValue: 10, color: 'blue' },
              { code: 'FREESHIP', description: 'Miễn phí vận chuyển', discountType: 'fixed', discountValue: 30000, color: 'green', icon: '🚚' },
              { code: 'SALE50', description: 'Giảm 50k cho đơn hàng từ 1 triệu', discountType: 'fixed', discountValue: 50000, color: 'purple' },
            ].map((voucher) => (
              <div
                key={voucher.code}
                className={`p-4 border-2 border-dashed border-${voucher.color}-200 rounded-xl hover:border-${voucher.color}-400 hover:bg-${voucher.color}-50 cursor-pointer transition-all group`}
                onClick={() => applyVoucher(voucher)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${voucher.color}-500 to-${voucher.color}-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                    {voucher.icon || (voucher.discountType === 'percentage' ? `${voucher.discountValue}%` : formatPrice(voucher.discountValue).replace('₫', ''))}
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold text-gray-900 group-hover:text-${voucher.color}-600 transition-colors`}>
                      {voucher.code}
                    </div>
                    <div className="text-sm text-gray-600">{voucher.description}</div>
                    <div className="text-xs text-green-600 mt-1">✓ Áp dụng được</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CheckoutPage;
