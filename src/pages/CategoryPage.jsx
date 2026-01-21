import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components/common';
import { CATEGORIES } from '../constants';
import { productService } from '../services/productService';
import { FiLoader, FiAlertCircle, FiPackage } from 'react-icons/fi';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const category = CATEGORIES.find((cat) => cat.id === categoryId);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await productService.getProductsByCategory(categoryId, {
          page,
          limit: 12
        });
        
        if (response.success) {
          setProducts(response.products || []);
          setPagination(response.pagination);
        } else {
          setError('Không thể tải sản phẩm');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId, page]);

  // Loading state
  if (loading) {
    return (
      <div className="py-8">
        <div className="container-custom">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FiLoader className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải sản phẩm...</p>
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
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="py-8">
        <div className="container-custom">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{category?.name || 'Danh mục'}</h1>
          </div>
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không có sản phẩm trong danh mục này</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{category?.name || 'Danh mục'}</h1>
          <p className="text-gray-600">
            Hiển thị {products.length} / {pagination?.total || products.length} sản phẩm
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                category: product.category,
                inStock: product.stock > 0,
                isNew: product.featured,
                rating: product.rating,
                reviewCount: product.reviewCount
              }} 
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
                  ? 'border-gray-300 hover:border-red-500 hover:text-red-500'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Trước
            </button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-4 py-2 rounded-lg border ${
                  pageNum === page
                    ? 'bg-red-500 text-white border-red-500'
                    : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={!pagination.hasNext}
              className={`px-4 py-2 rounded-lg border ${
                pagination.hasNext
                  ? 'border-gray-300 hover:border-red-500 hover:text-red-500'
                  : 'border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
