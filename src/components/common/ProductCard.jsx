import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscount } from '../../utils/helpers';
import { FiShoppingCart, FiHeart, FiStar, FiPackage, FiCheck } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cartSlice';

// Variant type badges - Updated với bảng màu mới
const TYPE_BADGES = {
  'nguyen-seal': { 
    label: 'Nguyên Seal', 
    color: 'bg-gradient-to-r from-[#5CDB95] to-[#379683]',
    textColor: 'text-white'
  },
  'openbox': { 
    label: 'Openbox', 
    color: 'bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95]',
    textColor: 'text-gray-800'
  },
  'cpo': { 
    label: 'CPO', 
    color: 'bg-gradient-to-r from-[#907163] to-[#b8917a]',
    textColor: 'text-white'
  },
};

const ProductCard = ({ product }) => {
  const { 
    id, 
    _id,
    name, 
    slug, 
    price, 
    originalPrice, 
    maxPrice,
    image, 
    category, 
    isNew, 
    isBestSeller,
    inStock, 
    stock,
    variants = [],
    rating = 0,
    reviewCount = 0
  } = product;
  
  const discount = originalPrice ? calculateDiscount(originalPrice, price) : 0;
  const productId = id || _id;
  const hasVariants = variants && variants.length > 0;
  const hasMultiplePrices = maxPrice && maxPrice > price;
  const isOutOfStock = stock === 0 || inStock === false;
  const dispatch = useDispatch();

  // Get unique variant types for badges
  const variantTypes = [...new Set(variants.map(v => v.type).filter(Boolean))];

  return (
    <div className="group relative bg-white rounded-2xl shadow-md shadow-gray-200/50 hover:shadow-xl hover:shadow-[#8EE4AF]/20 transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#8EE4AF]/30">
      <Link to={`/san-pham/${slug || productId}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-[#EDF5E1]/50 to-white overflow-hidden">
          <img
            src={image || '/placeholder-product.jpg'}
            alt={name}
            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-all duration-500"
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Badges - Top Left */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {discount > 0 && (
              <span className="bg-gradient-to-r from-[#907163] to-[#b8917a] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-[#907163]/30">
                -{discount}%
              </span>
            )}
            {isNew && (
              <span className="bg-gradient-to-r from-[#5CDB95] to-[#379683] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-[#5CDB95]/30">
                MỚI
              </span>
            )}
            {isBestSeller && (
              <span className="bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-[#8EE4AF]/30">
                BÁN CHẠY
              </span>
            )}
          </div>

          {/* Variant Type Badges - Top Right */}
          {variantTypes.length > 0 && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              {variantTypes.slice(0, 2).map(type => {
                const badge = TYPE_BADGES[type];
                return badge ? (
                  <span 
                    key={type} 
                    className={`${badge.color} ${badge.textColor} text-[10px] font-bold px-2 py-1 rounded-full shadow-md`}
                  >
                    {badge.label}
                  </span>
                ) : null;
              })}
              {variantTypes.length > 2 && (
                <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                  +{variantTypes.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Quick Actions - Hidden until hover */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20">
            <button 
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 hover:bg-[#EDF5E1]"
              onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            dispatch(addToCart({
              productId,
              name,
              price,
              image,
              quantity: 1,
            }));
          }}
          >
              <FiHeart size={18} className="text-[#907163]" />
            </button>
            <button 
              className="w-10 h-10 bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart functionality
              }}
            >
              <FiShoppingCart size={18} />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-center">
                  <FiPackage size={32} className="mx-auto mb-3 opacity-70" />
                  <span className="font-bold text-lg block">HẾT HÀNG</span>
                  <span className="text-sm opacity-90 mt-1 block">Vui lòng kiểm tra lại sau</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 bg-gradient-to-b from-white to-[#EDF5E1]/30">
          {/* Category */}
          {category && (
            <span className="text-xs font-medium text-[#379683] uppercase tracking-wider">
              {typeof category === 'object' ? category.name : category}
            </span>
          )}

          {/* Name */}
          <h3 className="font-semibold text-gray-800 mt-2 line-clamp-2 group-hover:text-[#379683] transition-colors duration-300 min-h-[3.5rem] leading-tight">
            {name}
          </h3>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i}
                    size={14}
                    className={`${i < Math.floor(rating) ? 'text-[#907163] fill-[#907163]' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({reviewCount})</span>
            </div>
          )}

          {/* Variants count */}
          {hasVariants && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-[#8EE4AF]"></div>
              <span className="text-gray-600">
                {variants.length} phiên bản có sẵn
              </span>
            </div>
          )}

          {/* Stock indicator */}
          {!isOutOfStock && stock && stock < 10 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full animate-pulse bg-[#907163]"></div>
              <span className="text-[#907163] font-medium">
                Còn {stock} sản phẩm
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-baseline justify-between">
              <div>
                {hasMultiplePrices ? (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Giá từ</div>
                    <span className="text-xl font-bold bg-gradient-to-r from-[#379683] to-[#5CDB95] bg-clip-text text-transparent">
                      {formatPrice(price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold bg-gradient-to-r from-[#379683] to-[#5CDB95] bg-clip-text text-transparent">
                    {formatPrice(price)}
                  </span>
                )}
                {originalPrice && originalPrice > price && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-xs font-medium bg-[#907163]/10 text-[#907163] px-2 py-0.5 rounded">
                      Tiết kiệm {formatPrice(originalPrice - price)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Free shipping badge */}
              {price > 2000000 && (
                <div className="flex items-center gap-1 text-xs bg-gradient-to-r from-[#8EE4AF]/20 to-[#EDF5E1]/50 text-[#379683] px-2 py-1 rounded-full border border-[#8EE4AF]/30">
                  <FiCheck size={10} />
                  <span className="font-semibold">Freeship</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA Button - Show on hover */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="w-full py-3 bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white font-semibold rounded-xl 
                        hover:shadow-lg hover:shadow-[#379683]/40 hover:scale-[1.02] active:scale-[0.98] 
                        transition-all duration-300 flex items-center justify-center gap-2"
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation();

                dispatch(addToCart({
                  productId: productId,
                  name,
                  price,
                  image,
                  quantity: 1,
                }));
              }}
            >

              <FiShoppingCart size={18} />
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
        </div>

        {/* Ribbon for exclusive products */}
        {isBestSeller && (
          <div className="absolute -top-3 -right-3">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-[#907163] to-[#b8917a] transform rotate-45 translate-x-8 -translate-y-8"></div>
              <div className="absolute top-7 right-1 text-white text-[10px] font-bold tracking-wider transform -rotate-45">
                HOT
              </div>
            </div>
          </div>
        )}
      </Link>
    </div>
  );
};

export default ProductCard;