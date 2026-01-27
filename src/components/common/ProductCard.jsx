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
    <div className="card group overflow-hidden">
      <Link to={`/san-pham/${slug || productId}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={image || '/placeholder-product.jpg'}
            alt={name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges - Top Left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {isNew && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Mới
              </span>
            )}
            {isBestSeller && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Bán chạy
              </span>
            )}
          </div>

          {/* Variant Type Badges - Top Right */}
          {variantTypes.length > 0 && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {variantTypes.slice(0, 2).map(type => {
                const badge = TYPE_BADGES[type];
                return badge ? (
                  <span
                    key={type}
                    className={`${badge.color} text-white text-[10px] font-medium px-1.5 py-0.5 rounded`}
                  >
                    {badge.label}
                  </span>
                ) : null;
              })}
              {variantTypes.length > 2 && (
                <span className="bg-gray-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  +{variantTypes.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Hết hàng</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {category && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {typeof category === 'object' ? category.name : category}
            </span>
          )}

          {/* Name */}
          <h3 className="font-medium text-gray-800 mt-1 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[48px]">
            {name}
          </h3>

          {/* Variants count */}
          {hasVariants && (
            <p className="text-xs text-gray-500 mt-1">
              {variants.length} phiên bản
            </p>
          )}

          {/* Price */}
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              {hasMultiplePrices ? (
                <span className="text-lg font-bold text-blue-600">
                  từ {formatPrice(price)}
                </span>
              ) : (
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(price)}
                </span>
              )}
            </div>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
