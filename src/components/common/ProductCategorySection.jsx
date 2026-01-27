import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from 'react-icons/fi';
import { formatPrice, calculateDiscount } from '../../utils/helpers';

const ProductCard = ({ product, onAddToCart }) => {
  const discount = calculateDiscount(product.originalPrice, product.price);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex-shrink-0 w-[200px]">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 p-4">
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
            -{discount}%
          </span>
        )}

        {/* Out of Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-lg">
              Hết Hàng
            </span>
          </div>
        )}

        <Link to={`/san-pham/${product.slug}`}>
          <img
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Product Name */}
        <Link to={`/san-pham/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors min-h-[40px]">
            {product.name}
          </h3>
        </Link>

        {/* Category Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price & Cart */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-red-600 font-bold text-base">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-gray-400 text-xs line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>

          {product.inStock && (
            <button
              onClick={() => onAddToCart?.(product)}
              className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
            >
              <FiShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCategorySection = ({
  title,
  titleColor = 'white',
  bgColor = 'bg-blue-800',
  products = [],
  filters = [],
  showViewAll = true,
  viewAllLink = '/san-pham',
  onAddToCart,
  className = '',
  headerClassName = '',
}) => {
  const [activeFilter, setActiveFilter] = useState(filters[0]?.value || 'all');
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 220;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const filteredProducts =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.condition === activeFilter);

  return (
    <div className={`mb-8 ${className}`}>
      {/* Header */}
      {(title || filters.length > 0 || showViewAll) && (
        <div className={`${bgColor} rounded-t-2xl px-6 py-4 ${headerClassName}`}>
          <div className="flex items-center justify-between">
            <h2
              className={`text-xl font-bold uppercase ${titleColor === 'white' ? 'text-white' : 'text-gray-900'
                }`}
            >
              {title}
            </h2>

            <div className="flex items-center gap-4">
              {/* Filter Tabs */}
              {/* {filters.length > 0 && (
                <div className="hidden md:flex items-center gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setActiveFilter(filter.value)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter.value
                        ? 'bg-white text-blue-800'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              )} */}

              {/* View All */}
              {showViewAll && (
                <Link
                  to={viewAllLink}
                  className="flex items-center gap-1 bg-white text-blue-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Xem tất cả
                  <FiChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Slider */}
      <div className="bg-gray-100 rounded-b-2xl p-4 relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        {/* Products Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export { ProductCard, ProductCategorySection };
export default ProductCategorySection;
