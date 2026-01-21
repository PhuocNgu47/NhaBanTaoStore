import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscount } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const { id, name, slug, price, originalPrice, image, category, isNew, inStock } = product;
  const discount = originalPrice ? calculateDiscount(originalPrice, price) : 0;

  return (
    <div className="card group overflow-hidden">
      <Link to={`/san-pham/${slug || id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={image || '/placeholder-product.jpg'}
            alt={name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
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
          </div>

          {/* Out of Stock Overlay */}
          {!inStock && (
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
              {category}
            </span>
          )}

          {/* Name */}
          <h3 className="font-medium text-gray-800 mt-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(price)}
            </span>
            {originalPrice && (
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
