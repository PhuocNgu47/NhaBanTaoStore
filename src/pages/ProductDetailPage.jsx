import { useState, useEffect } from 'react';
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
} from 'react-icons/fi';
import { useCart } from '../hooks';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import { productService } from '../services/productService';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await productService.getProductBySlug(slug);
        
        if (response.success && response.product) {
          const prod = response.product;
          setProduct(prod);
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
  
  // Extract colors and storage from variants
  const storageOptions = [];
  const seenStorage = new Set();
  (product.variants || []).forEach(v => {
    const storage = v.attributes?.storage || v.name;
    if (!seenStorage.has(storage)) {
      seenStorage.add(storage);
      storageOptions.push({ ...v, displayName: storage });
    }
  });

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
              {storageOptions.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Dung lượng</h3>
                  <div className="flex flex-wrap gap-3">
                    {storageOptions.map((variant) => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`relative px-6 py-3 border-2 rounded-xl font-medium transition-all ${
                          selectedVariant?._id === variant._id
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {variant.displayName}
                        {selectedVariant?._id === variant._id && (
                          <FiCheck className="absolute top-1 right-1 w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
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
