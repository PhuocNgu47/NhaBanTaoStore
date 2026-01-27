import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscount } from '../../utils/helpers';

// Variant type badges
const TYPE_BADGES = {
  'nguyen-seal': { label: 'Nguyên Seal', color: 'bg-green-500' },
  'openbox': { label: 'Openbox', color: 'bg-blue-500' },
  'cpo': { label: 'CPO', color: 'bg-orange-500' },
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
    variants = []
  } = product;

  const discount = originalPrice ? calculateDiscount(originalPrice, price) : 0;
  const productId = id || _id;
  const hasVariants = variants && variants.length > 0;
  const hasMultiplePrices = maxPrice && maxPrice > price;
  const isOutOfStock = stock === 0 || inStock === false;

  // Get unique variant types for badges
  const variantTypes = [...new Set(variants.map(v => v.type).filter(Boolean))];

  return (
    <div className="card group h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative">
      <Link to={`/san-pham/${slug || productId}`} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square bg-white overflow-hidden p-4">
          <img
            src={image || '/placeholder-product.jpg'}
            alt={name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Badges - Simplified & Smaller */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                -{discount}%
              </span>
            )}
            {isNew && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                Mới
              </span>
            )}
            {isBestSeller && (
              <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                Hot
              </span>
            )}
          </div>

          {/* Micro-interaction: Quick Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center z-20">
            <button className="bg-black/80 hover:bg-black text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg backdrop-blur-sm transform active:scale-95 transition-all">
              Xem chi tiết
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-30">
              <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">Hết hàng</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">
          {/* Category */}
          {category && (
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1 truncate">
              {typeof category === 'object' ? category.name : category}
            </div>
          )}

          {/* Name */}
          <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors" style={{ minHeight: '2.5em' }}>
            {name}
          </h3>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              {hasMultiplePrices ? (
                <span className="text-base font-bold text-red-600">
                  từ {formatPrice(price)}
                </span>
              ) : (
                <span className="text-base font-bold text-red-600">
                  {formatPrice(price)}
                </span>
              )}

              {originalPrice && originalPrice > price && (
                <span className="text-xs text-gray-400 line-through decoration-gray-400">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* Variant Type Badges - Moved to bottom for cleaner look */}
            {variantTypes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {variantTypes.slice(0, 2).map(type => {
                  const badge = TYPE_BADGES[type];
                  return badge ? (
                    <span
                      key={type}
                      className={`text-[9px] px-1.5 py-0.5 rounded border ${type === 'nguyen-seal' ? 'border-green-200 text-green-700 bg-green-50' :
                        type === 'openbox' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                          'border-orange-200 text-orange-700 bg-orange-50'
                        }`}
                    >
                      {badge.label}
                    </span>
                  ) : null;
                })}
                {variantTypes.length > 2 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded border border-gray-200 text-gray-500 bg-gray-50">
                    +{variantTypes.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
