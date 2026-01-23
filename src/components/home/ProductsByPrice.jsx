import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../common';
import { productService } from '../../services/productService';
import { 
  FiChevronRight, 
  FiFilter, 
  FiDollarSign, 
  FiSmartphone, 
  FiTablet, 
  FiMonitor, 
  FiWatch,
  FiTrendingUp,
  FiZap,
  FiStar
} from 'react-icons/fi';

const priceRanges = [
  { 
    label: 'Tất cả sản phẩm', 
    value: 'all', 
    minPrice: null, 
    maxPrice: null, 
    category: null,
    icon: FiTrendingUp,
    color: 'from-[#8EE4AF] to-[#5CDB95]'
  },
  { 
    label: 'iPhone', 
    value: 'iphone', 
    minPrice: null, 
    maxPrice: null, 
    category: 'iphone',
    icon: FiSmartphone,
    color: 'from-[#379683] to-[#5CDB95]'
  },
  { 
    label: 'iPad', 
    value: 'ipad', 
    minPrice: null, 
    maxPrice: null, 
    category: 'ipad',
    icon: FiTablet,
    color: 'from-[#907163] to-[#b8917a]'
  },
  { 
    label: 'MacBook', 
    value: 'macbook', 
    minPrice: null, 
    maxPrice: null, 
    category: 'macbook',
    icon: FiMonitor,
    color: 'from-[#5CDB95] to-[#379683]'
  },
  { 
    label: 'Apple Watch', 
    value: 'watch', 
    minPrice: null, 
    maxPrice: null, 
    category: 'watch',
    icon: FiWatch,
    color: 'from-[#8EE4AF] to-[#EDF5E1]'
  },
  { 
    label: 'Dưới 10 triệu', 
    value: 'under-10m', 
    minPrice: 0, 
    maxPrice: 10000000, 
    category: null,
    icon: FiDollarSign,
    color: 'from-[#5CDB95] to-[#8EE4AF]'
  },
  { 
    label: '10 - 20 triệu', 
    value: '10-20m', 
    minPrice: 10000000, 
    maxPrice: 20000000, 
    category: null,
    icon: FiDollarSign,
    color: 'from-[#379683] to-[#5CDB95]'
  },
  { 
    label: '20 - 30 triệu', 
    value: '20-30m', 
    minPrice: 20000000, 
    maxPrice: 30000000, 
    category: null,
    icon: FiDollarSign,
    color: 'from-[#907163] to-[#b8917a]'
  },
  { 
    label: 'Trên 30 triệu', 
    value: 'over-30m', 
    minPrice: 30000000, 
    maxPrice: null, 
    category: null,
    icon: FiDollarSign,
    color: 'from-[#379683] to-[#05386B]'
  },
  { 
    label: 'Khuyến mãi hot', 
    value: 'discount', 
    minPrice: null, 
    maxPrice: null, 
    category: null,
    icon: FiZap,
    color: 'from-[#8EE4AF] to-[#5CDB95]',
    discountOnly: true
  },
  { 
    label: 'Bán chạy nhất', 
    value: 'best-seller', 
    minPrice: null, 
    maxPrice: null, 
    category: null,
    icon: FiStar,
    color: 'from-[#907163] to-[#b8917a]',
    sortBy: 'bestSeller'
  },
];

const ProductsByPrice = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({ count: 0, minPrice: 0, maxPrice: 0 });

  useEffect(() => {
    fetchProducts();
  }, [activeFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const selectedRange = priceRanges.find(r => r.value === activeFilter);
      const params = {
        limit: 8,
        sort: selectedRange?.sortBy || 'newest'
      };

      // Add price filters
      if (selectedRange?.minPrice !== null) {
        params.minPrice = selectedRange.minPrice;
      }
      if (selectedRange?.maxPrice !== null) {
        params.maxPrice = selectedRange.maxPrice;
      }

      // Add discount filter
      if (selectedRange?.discountOnly) {
        params.discount = true;
      }

      let response;
      
      // If category filter, use category endpoint
      if (selectedRange?.category) {
        response = await productService.getProductsByCategory(selectedRange.category, params);
      } else {
        response = await productService.getProducts(params);
      }

      if (response.success) {
        // Transform products to match ProductCard expected format
        const transformedProducts = response.products.map(product => ({
          id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.variants?.[0]?.price || product.price,
          originalPrice: product.variants?.[0]?.originalPrice || product.originalPrice,
          image: product.images?.[0] || product.image || '/placeholder-product.jpg',
          category: product.category?.name || product.category,
          inStock: product.stock > 0,
          isNew: product.badges?.includes('new') || false,
          isBestSeller: product.badges?.includes('bestSeller') || false,
          rating: product.rating || 4.5,
          reviewCount: product.reviewCount || 12,
          tags: product.tags || [],
          stock: product.stock || 10
        }));
        setProducts(transformedProducts);
        
        // Calculate stats
        if (transformedProducts.length > 0) {
          const prices = transformedProducts.map(p => p.price);
          setStats({
            count: transformedProducts.length,
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices)
          });
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (value) => {
    setActiveFilter(value);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const selectedRange = priceRanges.find(r => r.value === activeFilter);
  const IconComponent = selectedRange?.icon || FiTrendingUp;

  return (
    <section className="py-12 bg-gradient-to-b from-[#EDF5E1]/20 to-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[#379683] to-[#5CDB95] bg-clip-text text-transparent">
              Tìm theo nhu cầu
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#379683] via-[#5CDB95] to-[#907163] bg-clip-text text-transparent mb-3">
            Sản phẩm theo tầm giá
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lựa chọn sản phẩm Apple phù hợp với ngân sách của bạn
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white p-5 rounded-t-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiFilter className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">LỌC THEO GIÁ</h2>
                  <p className="text-white/80 text-sm">Chọn tiêu chí lọc</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-b-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
              <div className="p-4 bg-gradient-to-r from-[#EDF5E1] to-white/50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95]"></div>
                  <span>Hiển thị: {products.length} sản phẩm</span>
                </div>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto p-1">
                {priceRanges.map((range) => {
                  const RangeIcon = range.icon;
                  const isActive = activeFilter === range.value;
                  
                  return (
                    <button
                      key={range.value}
                      onClick={() => handleFilterClick(range.value)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 mb-1 group ${
                        isActive
                          ? `bg-gradient-to-r ${range.color} text-white shadow-lg`
                          : 'hover:bg-gradient-to-r hover:from-[#EDF5E1] hover:to-white text-gray-700 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-white/20' : `bg-gradient-to-r ${range.color}/20`
                          }`}>
                            <RangeIcon className={`w-5 h-5 ${isActive ? 'text-white' : `text-${range.color.split('from-')[1].split(' ')[0]}`}`} />
                          </div>
                          <span className="font-medium">{range.label}</span>
                        </div>
                        
                        <div className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-white' : `bg-gradient-to-r ${range.color} opacity-0 group-hover:opacity-100`
                        }`}></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats Card */}
            {stats.count > 0 && (
              <div className="mt-6 bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95]"></div>
                  Thống kê
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Số lượng sản phẩm</div>
                    <div className="text-lg font-bold text-[#379683]">{stats.count}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Giá thấp nhất</div>
                    <div className="text-sm font-medium text-[#5CDB95]">{formatPrice(stats.minPrice)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Giá cao nhất</div>
                    <div className="text-sm font-medium text-[#907163]">{formatPrice(stats.maxPrice)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Active Filter Header */}
            <div className="bg-gradient-to-r from-white to-[#EDF5E1]/30 rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${selectedRange?.color} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{selectedRange?.label}</h3>
                    <p className="text-gray-600 text-sm">
                      {products.length} sản phẩm được tìm thấy
                    </p>
                  </div>
                </div>
                
                {selectedRange?.minPrice !== null && selectedRange?.maxPrice !== null && (
                  <div className="bg-gradient-to-r from-[#EDF5E1] to-white px-4 py-2 rounded-full border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      {formatPrice(selectedRange.minPrice)} - {selectedRange.maxPrice ? formatPrice(selectedRange.maxPrice) : 'Trên'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#EDF5E1] border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] opacity-20 blur-md"></div>
                </div>
                <span className="mt-4 text-gray-500">Đang tải sản phẩm...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-[#EDF5E1] to-white rounded-full flex items-center justify-center mb-6">
                  <FiFilter className="w-12 h-12 text-[#907163]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Không có sản phẩm</h3>
                <p className="text-gray-600 max-w-md">
                  Không tìm thấy sản phẩm nào phù hợp với tiêu chí lọc của bạn.
                </p>
                <button 
                  onClick={() => setActiveFilter('all')}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-[#EDF5E1] to-[#8EE4AF]/30 text-[#379683] font-medium rounded-full hover:shadow-md transition-all duration-300"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* View All Button */}
                <div className="text-center mt-10">
                  <Link
                    to="/san-pham"
                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white px-8 py-3.5 rounded-full font-semibold hover:shadow-xl hover:shadow-[#379683]/40 hover:scale-105 transition-all duration-300"
                  >
                    <span>Xem tất cả sản phẩm</span>
                    <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  {/* Price Range Info */}
                  <div className="mt-6 inline-flex items-center gap-4 bg-gradient-to-r from-[#EDF5E1] to-white px-6 py-3 rounded-full border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95]"></div>
                      <span className="text-sm text-gray-700">Khoảng giá từ:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#5CDB95]">{formatPrice(stats.minPrice)}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm font-medium text-[#907163]">{formatPrice(stats.maxPrice)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsByPrice;