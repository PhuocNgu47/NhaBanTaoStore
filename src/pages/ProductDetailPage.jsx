import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiCheck,
  FiTruck,
  FiAward,
  FiCreditCard,
  FiRefreshCw,
  FiLoader,
  FiAlertCircle,
  FiPackage,
} from 'react-icons/fi';
import { useCart, useTracking } from '../hooks';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import { productService } from '../services/productService';

// Variant types & models config
const VARIANT_TYPES = [
  { value: 'nguyen-seal', label: 'Nguyên Seal', color: 'bg-green-100 text-green-700 border-green-300', badge: '🆕' },
  { value: 'openbox', label: 'Openbox', color: 'bg-blue-100 text-blue-700 border-blue-300', badge: '📦' },
  { value: 'cpo', label: 'CPO', color: 'bg-orange-100 text-orange-700 border-orange-300', badge: '✨' },
];

const VARIANT_MODELS = [
  { value: 'wifi', label: 'Wifi Only' },
  { value: 'wifi-cellular', label: 'Wifi + Cellular' },
];

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { trackView } = useTracking();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Variant selection states - MUST be before any early returns
  const [selectedType, setSelectedType] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Group variants by type, model, storage, color - MUST be before any early returns
  const variantOptions = useMemo(() => {
    const variants = product?.variants || [];
    
    // Get unique types
    const types = [...new Set(variants.map(v => v.type).filter(Boolean))];
    
    // Get unique models (for iPad)
    const models = [...new Set(variants.map(v => v.model).filter(Boolean))];
    
    // Get unique storage options
    const storages = [...new Set(variants.map(v => v.attributes?.storage).filter(Boolean))];
    
    // Get unique colors
    const colors = [...new Set(variants.map(v => v.attributes?.color).filter(Boolean))];
    
    return { types, models, storages, colors, variants };
  }, [product?.variants]);

  // Set default selections when product loads
  useEffect(() => {
    const variants = product?.variants || [];
    if (variants.length === 0) return;

    // Set defaults on first load
    if (!selectedType && variantOptions.types.length > 0) {
      setSelectedType(variantOptions.types[0]);
    }
    if (!selectedModel && variantOptions.models.length > 0) {
      setSelectedModel(variantOptions.models[0]);
    }
    if (!selectedStorage && variantOptions.storages.length > 0) {
      setSelectedStorage(variantOptions.storages[0]);
    }
    if (!selectedColor && variantOptions.colors.length > 0) {
      setSelectedColor(variantOptions.colors[0]);
    }
  }, [variantOptions, selectedType, selectedModel, selectedStorage, selectedColor, product?.variants]);

  // Find matching variant based on selections
  useEffect(() => {
    const variants = product?.variants || [];
    if (variants.length === 0) return;

    let matchedVariant = variants.find(v => {
      const typeMatch = !selectedType || v.type === selectedType;
      const modelMatch = !selectedModel || variantOptions.models.length === 0 || v.model === selectedModel;
      const storageMatch = !selectedStorage || v.attributes?.storage === selectedStorage;
      const colorMatch = !selectedColor || variantOptions.colors.length === 0 || v.attributes?.color === selectedColor;
      return typeMatch && modelMatch && storageMatch && colorMatch && v.isActive !== false;
    });

    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
    } else {
      // If no exact match, find closest match
      matchedVariant = variants.find(v => v.isActive !== false);
      if (matchedVariant) setSelectedVariant(matchedVariant);
    }
  }, [selectedType, selectedModel, selectedStorage, selectedColor, product?.variants, variantOptions.models.length, variantOptions.colors.length]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await productService.getProductBySlug(slug);
        
        if (response.success && response.product) {
          const prod = response.product;
          setProduct(prod);
          
          // Track product view
          trackView(prod);
          
          // Set default variant
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          } else {
            setSelectedVariant({
              _id: prod._id,
              name: 'Mặc định',
              price: prod.price,
              originalPrice: prod.originalPrice,
              stock: prod.stock
            });
          }
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FiLoader className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-800 font-medium mb-2">Không tìm thấy sản phẩm</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const currentOriginalPrice = selectedVariant?.originalPrice || product.originalPrice;
  const discount = calculateDiscount(currentOriginalPrice, currentPrice);
  const images = product.images?.length > 0 ? product.images : [product.image || '/placeholder-product.jpg'];

  // Get available options based on current selections
  const getAvailableOptions = (field) => {
    const variants = product?.variants || [];
    return variants.filter(v => {
      if (field !== 'type' && selectedType && v.type !== selectedType) return false;
      if (field !== 'model' && selectedModel && variantOptions.models.length > 0 && v.model !== selectedModel) return false;
      if (field !== 'storage' && selectedStorage && v.attributes?.storage !== selectedStorage) return false;
      if (field !== 'color' && selectedColor && variantOptions.colors.length > 0 && v.attributes?.color !== selectedColor) return false;
      return v.isActive !== false;
    });
  };

  // Convert specifications object to array
  const specifications = product.specifications 
    ? Object.entries(product.specifications).map(([label, value]) => ({ label, value }))
    : [];

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: currentPrice,
      image: images[0],
      quantity,
      variant: selectedVariant?.name || 'Mặc định',
    });
  };

  const handleBuyNow = () => {
    const buyNowItem = {
      id: product._id,
      name: product.name,
      price: currentPrice,
      image: images[0],
      quantity,
      variant: selectedVariant?.name || 'Mặc định',
    };
    navigate('/thanh-toan', { state: { buyNowItem } });
  };

  return (
    <div className="py-8 bg-gray-50">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 cursor-pointer">Trang chủ</Link>
          <span className="mx-2">›</span>
          <Link to={`/danh-muc/${product.category?.slug || 'ipad'}`} className="hover:text-blue-600 cursor-pointer">
            {product.category?.name || 'Sản phẩm'}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Images */}
            <div className="p-6 lg:p-8">
              {/* Main Image */}
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 relative">
                <img
                  src={images[selectedImage] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
                {/* Previous/Next Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image || '/placeholder-product.jpg'}
                        alt=""
                        className="w-full h-full object-contain p-1 bg-gray-50"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="p-6 lg:p-8 bg-gradient-to-br from-white to-gray-50">
              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="mb-4">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-red-600">
                    {formatPrice(currentPrice)}
                  </span>
                  {currentOriginalPrice > currentPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(currentOriginalPrice)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-md">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Voucher Badge */}
                {product.badges?.includes('voucher') && (
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg border border-green-300">
                    <FiCheck className="w-5 h-5" />
                    <span className="font-medium">Giá khi mua với voucher 🎫</span>
                  </div>
                )}
              </div>

              {/* Storage Options */}
              {/* Variant Type (Nguyên Seal / Openbox / CPO) */}
              {variantOptions.types.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Tình trạng máy</h3>
                  <div className="flex flex-wrap gap-3">
                    {variantOptions.types.map((type) => {
                      const typeConfig = VARIANT_TYPES.find(t => t.value === type);
                      const available = getAvailableOptions('type').some(v => v.type === type);
                      return (
                        <button
                          key={type}
                          onClick={() => available && setSelectedType(type)}
                          disabled={!available}
                          className={`relative px-4 py-2 border-2 rounded-xl font-medium transition-all ${
                            selectedType === type
                              ? `${typeConfig?.color || 'border-blue-600 bg-blue-50 text-blue-700'} border-2 shadow-sm`
                              : available
                                ? 'border-gray-300 text-gray-700 hover:border-gray-400'
                                : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <span className="mr-1">{typeConfig?.badge}</span>
                          {typeConfig?.label || type}
                          {selectedType === type && (
                            <FiCheck className="absolute top-1 right-1 w-4 h-4" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {/* Type explanation */}
                  <div className="mt-2 text-sm text-gray-500">
                    {selectedType === 'nguyen-seal' && '🆕 Máy mới 100%, nguyên seal, chưa kích hoạt'}
                    {selectedType === 'openbox' && '📦 Máy đã mở hộp, mới 99%, bảo hành đầy đủ'}
                    {selectedType === 'cpo' && '✨ Máy Apple đã qua sử dụng, được Apple chứng nhận'}
                  </div>
                </div>
              )}

              {/* Variant Model (Wifi / Cellular) - for iPad */}
              {variantOptions.models.length > 1 && (
                <div className="mb-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Kết nối</h3>
                  <div className="flex flex-wrap gap-3">
                    {variantOptions.models.map((model) => {
                      const modelConfig = VARIANT_MODELS.find(m => m.value === model);
                      const available = getAvailableOptions('model').some(v => v.model === model);
                      return (
                        <button
                          key={model}
                          onClick={() => available && setSelectedModel(model)}
                          disabled={!available}
                          className={`relative px-5 py-3 border-2 rounded-xl font-medium transition-all ${
                            selectedModel === model
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                              : available
                                ? 'border-gray-300 text-gray-700 hover:border-gray-400'
                                : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {modelConfig?.label || model}
                          {selectedModel === model && (
                            <FiCheck className="absolute top-1 right-1 w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Storage Options */}
              {variantOptions.storages.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Dung lượng</h3>
                  <div className="flex flex-wrap gap-3">
                    {variantOptions.storages.map((storage) => {
                      const available = getAvailableOptions('storage').some(v => v.attributes?.storage === storage);
                      return (
                        <button
                          key={storage}
                          onClick={() => available && setSelectedStorage(storage)}
                          disabled={!available}
                          className={`relative px-6 py-3 border-2 rounded-xl font-medium transition-all ${
                            selectedStorage === storage
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                              : available
                                ? 'border-gray-300 text-gray-700 hover:border-gray-400'
                                : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50 line-through'
                          }`}
                        >
                          {storage}
                          {selectedStorage === storage && (
                            <FiCheck className="absolute top-1 right-1 w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color Options */}
              {variantOptions.colors.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Màu sắc</h3>
                  <div className="flex flex-wrap gap-3">
                    {variantOptions.colors.map((color) => {
                      const available = getAvailableOptions('color').some(v => v.attributes?.color === color);
                      return (
                        <button
                          key={color}
                          onClick={() => available && setSelectedColor(color)}
                          disabled={!available}
                          className={`relative px-5 py-3 border-2 rounded-xl font-medium transition-all ${
                            selectedColor === color
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                              : available
                                ? 'border-gray-300 text-gray-700 hover:border-gray-400'
                                : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {color}
                          {selectedColor === color && (
                            <FiCheck className="absolute top-1 right-1 w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selected Variant Info */}
              {selectedVariant && (
                <div className="mb-5 p-4 bg-gray-50 rounded-xl border">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiPackage className="w-4 h-4" />
                    <span className="font-medium">Biến thể đã chọn:</span>
                    <span>{selectedVariant.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    SKU: {selectedVariant.sku}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700 font-bold text-xl"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-16 h-12 text-center font-semibold text-lg border-x-2 border-gray-300"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(selectedVariant?.stock || product.stock || 99, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700 font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-500 text-sm">
                    Còn {selectedVariant?.stock || product.stock || 0} sản phẩm
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  MUA NGAY
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition-all">
                    MUA TRẢ GÓP
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    THÊM VÀO GIỎ HÀNG
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiRefreshCw className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">1 ĐỔI 1 TRONG 6 THÁNG</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiAward className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">HÀNG CHÍNH HÃNG APPLE</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiTruck className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">FREESHIP TOÀN QUỐC</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiCreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">TRẢ GÓP QUA THẺ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          {specifications.length > 0 && (
            <div className="border-t border-gray-200 p-6 lg:p-8 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>THÔNG SỐ KỸ THUẬT</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-gray-600 font-medium">{spec.label}</span>
                    <span className="font-semibold text-gray-900 text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          {product.description && (
            <div className="border-t border-gray-200 p-6 lg:p-8 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MÔ TẢ SẢN PHẨM</h2>
              <div className="prose max-w-none text-gray-700">
                <p>{product.description}</p>
              </div>
            </div>
          )}

          {/* Vouchers Section */}
          <div className="border-t border-gray-200 p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-white">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Voucher ưu đãi dành cho sản phẩm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎫</span>
                </div>
                <div>
                  <p className="font-bold text-blue-700">Giảm 500.000đ</p>
                  <p className="text-sm text-gray-600">Cho đơn hàng từ 15 triệu</p>
                </div>
              </div>
              <div className="bg-white border-2 border-dashed border-green-300 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <p className="font-bold text-green-700">Tặng phụ kiện</p>
                  <p className="text-sm text-gray-600">Trị giá 300.000đ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
