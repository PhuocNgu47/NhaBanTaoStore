import { useState } from 'react';
import { ProductCard } from '../components/common';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: 'iPad Pro 11 inch M4 2024 WiFi',
    slug: 'ipad-pro-11-inch-m4-2024-wifi',
    price: 23990000,
    originalPrice: 36990000,
    image: '/products/ipad-pro.jpg',
    category: 'iPad',
    inStock: true,
    isNew: true,
  },
  {
    id: 2,
    name: 'MacBook Air 13 inch M3 2024',
    slug: 'macbook-air-13-inch-m3-2024',
    price: 24990000,
    originalPrice: 35990000,
    image: '/products/macbook-air.jpg',
    category: 'MacBook',
    inStock: true,
    isNew: true,
  },
  {
    id: 3,
    name: 'iPad Air 11 inch M2 2024 WiFi',
    slug: 'ipad-air-11-inch-m2-2024-wifi',
    price: 15990000,
    originalPrice: 23990000,
    image: '/products/ipad-air.jpg',
    category: 'iPad',
    inStock: true,
    isNew: false,
  },
  {
    id: 4,
    name: 'iPad 10.9 inch 2022',
    slug: 'ipad-10-9-inch-2022',
    price: 9990000,
    originalPrice: 13190000,
    image: '/products/ipad-10.jpg',
    category: 'iPad',
    inStock: true,
    isNew: false,
  },
  {
    id: 5,
    name: 'AirPods Pro 2',
    slug: 'airpods-pro-2',
    price: 5990000,
    originalPrice: 6990000,
    image: '/products/airpods-pro.jpg',
    category: 'Âm thanh',
    inStock: true,
    isNew: false,
  },
  {
    id: 6,
    name: 'AirPods 3',
    slug: 'airpods-3',
    price: 3990000,
    originalPrice: 4490000,
    image: '/products/airpods-3.jpg',
    category: 'Âm thanh',
    inStock: true,
    isNew: false,
  },
  {
    id: 7,
    name: 'Apple Pencil Pro',
    slug: 'apple-pencil-pro',
    price: 3490000,
    originalPrice: 3990000,
    image: '/products/apple-pencil.jpg',
    category: 'Bút cảm ứng',
    inStock: true,
    isNew: true,
  },
  {
    id: 8,
    name: 'Magic Keyboard for iPad Pro',
    slug: 'magic-keyboard-ipad-pro',
    price: 8990000,
    originalPrice: 9990000,
    image: '/products/magic-keyboard.jpg',
    category: 'Phụ kiện iPad',
    inStock: true,
    isNew: false,
  },
];

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'name', label: 'Tên A-Z' },
];

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tất cả sản phẩm</h1>
          <p className="text-gray-600">Hiển thị {mockProducts.length} sản phẩm</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <FiFilter />
            <span>Bộ lọc</span>
          </button>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                }`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                }`}
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Sidebar (Mobile) */}
        {showFilters && (
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <h3 className="font-semibold mb-4">Lọc theo giá</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Dưới 10 triệu</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>10 - 20 triệu</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>20 - 30 triệu</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Trên 30 triệu</span>
              </label>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-4'
          }
        >
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Trước</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">3</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
