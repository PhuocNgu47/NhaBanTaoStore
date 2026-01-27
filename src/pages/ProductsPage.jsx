import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard, CategorySidebar } from '../components/common';
import { productService } from '../services/productService';
import {
  FiLoader,
  FiAlertCircle,
  FiPackage,
  FiGrid,
  FiList,
  FiFilter,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters from URL or default
  const page = parseInt(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  // Helper to update URL params
  const updateParams = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const sortOptions = {
          newest: { sort: 'createdAt', order: 'desc' },
          priceAsc: { sort: 'price', order: 'asc' },
          priceDesc: { sort: 'price', order: 'desc' },
          nameAsc: { sort: 'name', order: 'asc' },
          nameDesc: { sort: 'name', order: 'desc' },
          popular: { sort: 'rating', order: 'desc' },
        };

        const params = {
          page,
          limit: 12,
          ...sortOptions[sortBy],
        };

        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const response = await productService.getProducts(params);

        if (response.success) {
          setProducts(response.products || []);
          setPagination(response.pagination);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Có lỗi xảy ra khi tải sản phẩm');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, sortBy, minPrice, maxPrice]);

  // Price filter handler
  const handlePriceFilter = (min, max) => {
    updateParams({ minPrice: min, maxPrice: max, page: 1 });
    setSidebarOpen(false);
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tất cả sản phẩm</h1>
            <p className="text-gray-500 mt-1">
              {loading ? 'Đang tải...' : `Hiển thị ${pagination?.total || 0} sản phẩm`}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0 lg:shadow-none lg:bg-transparent
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="h-full overflow-y-auto p-4 lg:p-0">
              <div className="flex justify-between items-center lg:hidden mb-4">
                <h2 className="font-bold text-lg">Bộ lọc</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <FiX size={24} />
                </button>
              </div>

              {/* Component CategorySidebar để hiển thị danh mục */}
              <div className="mb-6">
                <CategorySidebar />
              </div>

              {/* Filter By Price */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-bold text-gray-800 mb-4">Khoảng giá</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handlePriceFilter(null, null)}
                    className={`block w-full text-left px-2 py-1 rounded text-sm ${!minPrice && !maxPrice ? 'text-red-500 font-medium bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => handlePriceFilter(0, 10000000)}
                    className={`block w-full text-left px-2 py-1 rounded text-sm ${maxPrice === '10000000' ? 'text-red-500 font-medium bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Dưới 10 triệu
                  </button>
                  <button
                    onClick={() => handlePriceFilter(10000000, 20000000)}
                    className={`block w-full text-left px-2 py-1 rounded text-sm ${minPrice === '10000000' && maxPrice === '20000000' ? 'text-red-500 font-medium bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    10 - 20 triệu
                  </button>
                  <button
                    onClick={() => handlePriceFilter(20000000, 30000000)}
                    className={`block w-full text-left px-2 py-1 rounded text-sm ${minPrice === '20000000' && maxPrice === '30000000' ? 'text-red-500 font-medium bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    20 - 30 triệu
                  </button>
                  <button
                    onClick={() => handlePriceFilter(30000000, null)}
                    className={`block w-full text-left px-2 py-1 rounded text-sm ${minPrice === '30000000' ? 'text-red-500 font-medium bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Trên 30 triệu
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
              <button
                className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                onClick={() => setSidebarOpen(true)}
              >
                <FiFilter /> Bộ lọc
              </button>

              <div className="flex items-center gap-4 ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Bán chạy</option>
                  <option value="priceAsc">Giá tăng dần</option>
                  <option value="priceDesc">Giá giảm dần</option>
                  <option value="nameAsc">Tên A-Z</option>
                  <option value="nameDesc">Tên Z-A</option>
                </select>

                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <FiGrid />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex justify-center py-20">
                <FiLoader className="w-10 h-10 animate-spin text-red-500" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Thử lại
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg shadow-sm">
                <FiPackage className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500">Không tìm thấy sản phẩm nào phù hợp.</p>
                <button
                  onClick={() => updateParams({ minPrice: null, maxPrice: null })}
                  className="mt-4 text-red-500 font-medium hover:underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'flex flex-col gap-4'
                }>
                  {products.map(product => (
                    <ProductCard
                      key={product._id}
                      product={{
                        ...product,
                        id: product._id,
                        inStock: product.stock > 0,
                        isNew: product.featured, // Map featured to isNew badge
                      }}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => updateParams({ page: Math.max(1, page - 1) })}
                      disabled={page <= 1}
                      className={`p-2 rounded-lg border ${page <= 1 ? 'text-gray-300 border-gray-200' : 'hover:bg-gray-50 border-gray-300'}`}
                    >
                      <FiChevronLeft />
                    </button>

                    {[...Array(pagination.pages)].map((_, i) => {
                      const p = i + 1;
                      if (
                        p === 1 ||
                        p === pagination.pages ||
                        (p >= page - 1 && p <= page + 1)
                      ) {
                        return (
                          <button
                            key={p}
                            onClick={() => updateParams({ page: p })}
                            className={`px-4 py-2 rounded-lg border ${p === page
                                ? 'bg-red-500 text-white border-red-500'
                                : 'hover:bg-gray-50 border-gray-300'
                              }`}
                          >
                            {p}
                          </button>
                        );
                      }
                      if (
                        p === page - 2 ||
                        p === page + 2
                      ) {
                        return <span key={p} className="px-2 self-end">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => updateParams({ page: Math.min(pagination.pages, page + 1) })}
                      disabled={page >= pagination.pages}
                      className={`p-2 rounded-lg border ${page >= pagination.pages ? 'text-gray-300 border-gray-200' : 'hover:bg-gray-50 border-gray-300'}`}
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
