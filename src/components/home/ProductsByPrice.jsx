import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { ProductCard } from '../common';
import { productService } from '../../services/productService';

const priceRanges = [
  { label: 'Tất cả', value: 'all', minPrice: null, maxPrice: null, category: null },
  { label: 'iPad', value: 'ipad', minPrice: null, maxPrice: null, category: 'ipad' },
  { label: 'MacBook', value: 'macbook', minPrice: null, maxPrice: null, category: 'macbook' },
  { label: 'Dưới 10 triệu', value: 'under-10m', minPrice: 0, maxPrice: 10000000, category: null },
  { label: '10 - 20 triệu', value: '10-20m', minPrice: 10000000, maxPrice: 20000000, category: null },
  { label: '20 - 30 triệu', value: '20-30m', minPrice: 20000000, maxPrice: 30000000, category: null },
  { label: 'Trên 30 triệu', value: 'over-30m', minPrice: 30000000, maxPrice: null, category: null },
];

const ProductsByPrice = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [activeFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const selectedRange = priceRanges.find(r => r.value === activeFilter);
      const params = {
        limit: 8,
        sort: 'newest'
      };

      // Add price filters
      if (selectedRange?.minPrice !== null) {
        params.minPrice = selectedRange.minPrice;
      }
      if (selectedRange?.maxPrice !== null) {
        params.maxPrice = selectedRange.maxPrice;
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
        }));
        setProducts(transformedProducts);
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

  return (
    <section className="py-8 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-blue-600 text-white p-4 rounded-t-xl">
              <h2 className="font-bold text-lg">SẢN PHẨM THEO TẦM GIÁ</h2>
            </div>
            <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleFilterClick(range.value)}
                  className={`w-full text-left px-4 py-3 border-b last:border-b-0 transition-colors ${
                    activeFilter === range.value
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex items-center justify-center min-h-[300px] text-gray-500">
                Không có sản phẩm trong tầm giá này
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            <div className="text-center mt-6">
              <Link
                to="/san-pham"
                className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsByPrice;
