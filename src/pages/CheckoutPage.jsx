import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiShoppingCart, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../hooks';
import { formatPrice } from '../utils/helpers';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ tên'),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  address: z.string().min(10, 'Vui lòng nhập địa chỉ đầy đủ'),
  city: z.string().min(2, 'Vui lòng chọn tỉnh/thành'),
  ward: z.string().min(2, 'Vui lòng chọn phường/xã'),
  note: z.string().optional(),
});

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
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.id <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`font-medium ${
                step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
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
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Kiểm tra xem có phải mua ngay hay không
  const buyNowItem = location.state?.buyNowItem;
  const isBuyNow = !!buyNowItem;

  // Sử dụng sản phẩm mua ngay hoặc giỏ hàng
  const items = isBuyNow ? [buyNowItem] : cartItems;
  const total = isBuyNow ? buyNowItem.price * buyNowItem.quantity : cartTotal;

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
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Create order data
      const orderData = {
        orderId: String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
        customerName: data.fullName,
        phone: data.phone.slice(0, 5) + '*****',
        email: data.email.replace(/(.{5}).*(@.*)/, '$1***********$2'),
        orderDate: new Date().toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        address: data.address + ', ' + data.ward + ', ' + data.city,
        paymentMethod: paymentMethod === 'bank_transfer' ? 'Chuyển khoản ngân hàng' : 'Thanh toán khi nhận hàng',
        shippingMethod: shippingMethod === 'standard' ? 'Giao hàng Tiêu chuẩn' : 'Giao hàng Nhanh',
        items: items,
        subtotal: total,
        shippingFee: null,
        total: total,
      };

      // Chỉ xóa giỏ hàng nếu không phải mua ngay
      if (!isBuyNow) {
        clearCart();
      }
      navigate('/dat-hang-thanh-cong', { state: { order: orderData } });
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* City */}
                    <div className="relative">
                      <select
                        {...register('city')}
                        className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Tỉnh/Thành phố</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="hn">Hà Nội</option>
                        <option value="dn">Đà Nẵng</option>
                        <option value="hp">Hải Phòng</option>
                        <option value="ct">Cần Thơ</option>
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    {/* Ward */}
                    <div className="relative">
                      <select
                        {...register('ward')}
                        className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Phường/Xã</option>
                        <option value="p1">Phường 1</option>
                        <option value="p2">Phường 2</option>
                        <option value="p3">Phường 3</option>
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      {errors.ward && (
                        <p className="text-red-500 text-sm mt-1">{errors.ward.message}</p>
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
                      className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
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
                    className={`flex flex-col gap-1 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
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
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'cod'
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
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      shippingMethod === 'standard'
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
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      shippingMethod === 'express'
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
        <Modal open={voucherModalOpen} onClose={closeVoucherModal} title="Chọn Voucher Khuyến Mãi">
          <div className="space-y-4">
            <p className="text-gray-600">Chọn một voucher để áp dụng cho đơn hàng của bạn:</p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {/* Voucher mẫu - thay bằng dữ liệu thực từ API */}
              {[
                { code: 'VOUCHER10', description: 'Giảm 10% cho đơn hàng từ 500k', discountType: 'percentage', discountValue: 10 },
                { code: 'FREESHIP', description: 'Miễn phí vận chuyển', discountType: 'fixed', discountValue: 30000 },
                { code: 'SALE50', description: 'Giảm 50k cho đơn hàng từ 1 triệu', discountType: 'fixed', discountValue: 50000 },
              ].map((voucher) => (
                <div
                  key={voucher.code}
                  className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => applyVoucher(voucher)}
                >
                  <div className="font-medium text-blue-600">{voucher.code}</div>
                  <div className="text-sm text-gray-600">{voucher.description}</div>
                  <div className="text-xs text-green-600 mt-1">
                    Giảm: {voucher.discountType === 'percentage' ? `${voucher.discountValue}%` : formatPrice(voucher.discountValue)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={closeVoucherModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CheckoutPage;
