import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiZap,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import { formatPrice, calculateDiscount } from '../../utils/helpers';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const discount = calculateDiscount(product.originalPrice, product.price);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-[#8EE4AF]/30 transition-all duration-500 flex-shrink-0 w-[240px] md:w-[260px] relative border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Ribbon for special products */}
      {product.isBestSeller && (
        <div className="absolute top-0 left-0 right-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#907163] to-[#b8917a] transform -skew-x-12"></div>
            <div className="relative px-3 py-1 text-center">
              <span className="text-xs font-bold text-white flex items-center justify-center gap-1">
                <FiZap className="w-3 h-3" />
                BÁN CHẠY NHẤT
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-[#EDF5E1]/50 to-white p-6">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-[#907163] to-[#b8917a] rounded-full flex items-center justify-center shadow-lg shadow-[#907163]/40">
                <span className="text-white font-bold text-sm">-{discount}%</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#907163] to-[#b8917a] opacity-30 blur-sm rounded-full"></div>
            </div>
          </div>
        )}

        {/* New Badge */}
        {product.isNew && (
          <div className="absolute top-3 right-3 z-10">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-[#5CDB95] to-[#379683] rounded-full flex items-center justify-center shadow-lg shadow-[#5CDB95]/40">
                <span className="text-white font-bold text-xs">MỚI</span>
              </div>
            </div>
          </div>
        )}

        {/* Stock Status Badge */}
        {!product.inStock && (
          <div className="absolute top-3 right-3 z-10">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
              <FiClock className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Product Image */}
        <Link to={`/san-pham/${product.slug}`}>
          <img
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-contain transform transition-all duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <FiClock className="w-8 h-8 text-white mx-auto mb-2" />
              <span className="text-white font-semibold text-sm block">HẾT HÀNG</span>
              <span className="text-white/80 text-xs block mt-1">Liên hệ đặt trước</span>
            </div>
          </div>
        )}

        {/* Quick Actions - Show on hover */}
        <div className={`absolute bottom-4 left-0 right-0 px-4 flex justify-center gap-2 z-20 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button
            onClick={() => onAddToWishlist?.(product)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 hover:bg-[#EDF5E1]"
            title="Thêm vào yêu thích"
          >
            <FiHeart className="w-4 h-4 text-[#907163]" />
          </button>
          {product.inStock && (
            <button
              onClick={() => onAddToCart?.(product)}
              className="px-4 py-2 bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium gap-2"
            >
              <FiShoppingCart className="w-4 h-4" />
              <span className="text-sm">Thêm giỏ hàng</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-gradient-to-b from-white to-[#EDF5E1]/30">
        {/* Category */}
        {product.category && (
          <div className="mb-2">
            <span className="text-xs font-medium text-[#379683] uppercase tracking-wider">
              {product.category}
            </span>
          </div>
        )}

        {/* Product Name */}
        <Link to={`/san-pham/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-[#379683] transition-colors duration-300 min-h-[44px] leading-tight group-hover:underline">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i}
                  size={12}
                  className={`${i < Math.floor(product.rating) ? 'text-[#907163] fill-[#907163]/20' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-[10px] text-[#5CDB95] bg-gradient-to-r from-[#EDF5E1] to-[#8EE4AF]/20 px-2 py-0.5 rounded-full border border-[#8EE4AF]/30"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span className="text-[10px] text-gray-500 px-2 py-0.5">
                +{product.tags.length - 2} khác
              </span>
            )}
          </div>
        )}

        {/* Price & Stock Info */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold bg-gradient-to-r from-[#379683] to-[#5CDB95] bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </p>
              {product.originalPrice && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                  <span className="text-xs font-medium bg-gradient-to-r from-[#907163]/10 to-[#b8917a]/10 text-[#907163] px-2 py-0.5 rounded">
                    Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Stock Indicator */}
            {product.inStock && product.stock !== undefined && (
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  product.stock < 10 ? 'bg-[#907163]' : 'bg-[#5CDB95]'
                }`}></div>
                <span className="text-xs text-gray-500">{product.stock} còn</span>
              </div>
            )}
          </div>

          {/* Free Shipping */}
          {product.price > 2000000 && product.inStock && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <div className="w-4 h-4 bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-[#379683] font-medium">Miễn phí vận chuyển</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCategorySection = ({
  title,
  subtitle,
  bgColor = 'bg-gradient-to-r from-[#379683] to-[#5CDB95]',
  titleColor = 'text-white',
  products = [],
  filters = [],
  showViewAll = true,
  viewAllLink = '/san-pham',
  onAddToCart,
  onAddToWishlist,
}) => {
  const [activeFilter, setActiveFilter] = useState(filters[0]?.value || 'all');
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  const filteredProducts =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.condition === activeFilter);

  return (
    <div className="mb-12">
      {/* Header */}
      <div className={`${bgColor} rounded-t-2xl px-6 py-5 relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute top-0 right-0 bottom-0 left-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-white to-transparent rounded-full -translate-x-20 translate-y-20"></div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold uppercase ${titleColor} mb-1`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`text-sm ${titleColor} opacity-90`}>
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            {/* Filter Tabs */}
            {filters.length > 0 && (
              <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilter === filter.value
                        ? 'bg-white text-[#379683] shadow-lg'
                        : 'text-white/90 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}

            {/* View All */}
            {showViewAll && (
              <Link
                to={viewAllLink}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30 group"
              >
                <span>Xem tất cả</span>
                <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Products Slider */}
      <div className="bg-gradient-to-b from-[#EDF5E1]/20 to-white rounded-b-2xl p-6 relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Products Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
            />
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Scroll indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === 0 ? 'bg-gradient-to-r from-[#379683] to-[#5CDB95] w-6' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ProductCard, ProductCategorySection };
export default ProductCategorySection;