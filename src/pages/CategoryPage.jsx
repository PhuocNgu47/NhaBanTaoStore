import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCard, CategorySidebar } from '../components/common';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import { 
  FiLoader, 
  FiAlertCircle, 
  FiPackage, 
  FiChevronRight, 
  FiGrid, 
  FiList,
  FiMenu
} from 'react-icons/fi';

const CategoryPage = () => {
  const { slug } = useParams();
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch category info
  useEffect(() => {
    const fetchCategory = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await categoryService.getCategoryBySlug(slug);
        if (response.success) {
          setCategory(response.category);
        } else {
          setError('Không tìm thấy danh mục');
        }
      } catch (err) {
        console.error('Error fetching category:', err);
        if (err.response?.status === 404) {
          setError('Danh mục không tồn tại');
        } else {
          setError(err.message || 'Có lỗi xảy ra');
        }
      } finally {
        setLoading(false);
      }
    };

    setPage(1);
    fetchCategory();
  }, [slug]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!category?._id) return;
      
      try {
        setProductsLoading(true);
        
        // Map sort options
        const sortOptions = {
          newest: { sort: '-createdAt' },
          oldest: { sort: 'createdAt' },
          priceAsc: { sort: 'price' },
          priceDesc: { sort: '-price' },
          nameAsc: { sort: 'name' },
          nameDesc: { sort: '-name' },
          popular: { sort: '-soldCount' },
        };

        const response = await productService.getProducts({
          category: category._id,
          page,
          limit: 12,
          ...sortOptions[sortBy],
        });
        
        if (response.success) {
          setProducts(response.products || []);
          setPagination(response.pagination);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [category?._id, page, sortBy]);

  // Loading state
  if (loading) {
    return (
      <div className="py-8">
        <div className="container-custom">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FiLoader className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải danh mục...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8">
        <div className="container-custom">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-800 font-medium mb-2">Có lỗi xảy ra</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                to="/"
                className="inline-block px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        {category?.breadcrumb && category.breadcrumb.length > 0 && (
          <nav className="mb-6">
            <ol className="flex items-center flex-wrap text-sm text-gray-600">
              <li className="flex items-center">
                <Link to="/" className="hover:text-red-500 transition-colors">
                  Trang chủ
                </Link>
                <FiChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              </li>
              {category.breadcrumb.map((item, index) => (
                <li key={item._id} className="flex items-center">
                  {index < category.breadcrumb.length - 1 ? (
                    <>
                      <Link 
                        to={`/danh-muc/${item.slug}`}
                        className="hover:text-red-500 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <FiChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                    </>
                  ) : (
                    <span className="text-red-500 font-medium">{item.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <CategorySidebar />
          </div>

          {/* Mobile sidebar */}
          <CategorySidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Category Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {category?.name}
                  </h1>
                  {category?.description && (
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{pagination?.total || 0} sản phẩm</span>
                </div>
              </div>

              {/* Subcategories */}
              {category?.children && category.children.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {category.children.map(child => (
                      <Link
                        key={child._id}
                        to={`/danh-muc/${child.slug}`}
                        className="px-4 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full text-sm transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filters & Sort */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Mobile filter button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <FiMenu className="w-5 h-5" />
                  <span>Danh mục</span>
                </button>

                {/* Sort */}
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-600">Sắp xếp:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Bán chạy</option>
                    <option value="priceAsc">Giá tăng dần</option>
                    <option value="priceDesc">Giá giảm dần</option>
                    <option value="nameAsc">Tên A-Z</option>
                    <option value="nameDesc">Tên Z-A</option>
                  </select>
                </div>

                {/* View mode */}
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-red-500 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-red-500 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <FiLoader className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Không có sản phẩm trong danh mục này</p>
                <Link
                  to="/"
                  className="inline-block mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Khám phá sản phẩm khác
                </Link>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'flex flex-col gap-4'
                }>
                  {products.map((product) => (
                    <ProductCard 
                      key={product._id} 
                      product={{
                        id: product._id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        images: product.images,
                        category: product.category,
                        inStock: product.stock > 0,
                        isNew: product.featured,
                        rating: product.rating,
                        reviewCount: product.reviewCount
                      }}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={!pagination.hasPrev}
                      className={`px-4 py-2 rounded-lg border ${
                        pagination.hasPrev
                          ? 'border-gray-300 bg-white hover:border-red-500 hover:text-red-500'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Trước
                    </button>
                    
                    {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-lg border ${
                            pageNum === page
                              ? 'bg-red-500 text-white border-red-500'
                              : 'border-gray-300 bg-white hover:border-red-500 hover:text-red-500'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={!pagination.hasNext}
                      className={`px-4 py-2 rounded-lg border ${
                        pagination.hasNext
                          ? 'border-gray-300 bg-white hover:border-red-500 hover:text-red-500'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Sau
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

export default CategoryPage;
