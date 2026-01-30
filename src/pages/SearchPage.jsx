import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/common';
import { FiSearch } from 'react-icons/fi';
import { productService } from '../services/productService';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return; /* Keep empty if no query, or could reset products */

      setLoading(true);
      try {
        const data = await productService.searchProducts(query);
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Failed to search products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  // Results used to be 'results', now use 'products'
  const results = products;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tim-kiem?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-6 py-4 text-lg border-2 border-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"
            >
              <FiSearch size={24} />
            </button>
          </div>
        </form>

        {/* Results */}
        {query && (
          <>
            <h1 className="text-xl text-gray-800 mb-6">
              Kết quả tìm kiếm cho: <span className="font-bold">"{query}"</span>
              <span className="text-gray-500 ml-2">
                {loading ? '...' : `(${results.length} sản phẩm)`}
              </span>
            </h1>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Đang tìm kiếm...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h2>
                <p className="text-gray-600">Vui lòng thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
