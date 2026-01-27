import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useAuth, useCart } from '../../hooks';
import { NAV_LINKS } from '../../constants';
import { categoryService } from '../../services/categoryService';

import { useSettings } from '../../contexts/SettingsContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [categories, setCategories] = useState([]);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const { settings } = useSettings();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getMenuCategories();
        if (response.success && response.menu) {
          // Chỉ lấy các category cấp 1 (parent categories)
          setCategories(response.menu.filter(cat => !cat.parent || cat.level === 0));
        }
      } catch (err) {
        // Không log lỗi để tránh spam console
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tim-kiem?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Header */}
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🍎</span>
            </div>
            <span className="text-xl font-bold text-blue-800 hidden sm:block uppercase">
              {settings.siteName || 'NHÀ BÁN TÁO STORE'}
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/gio-hang" className="relative p-2 text-gray-700 hover:text-blue-600">
              <FiShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-gray-700 hover:text-blue-600">
                  <FiUser size={24} />
                  <span className="hidden md:block">{user?.name}</span>
                  <FiChevronDown size={16} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/tai-khoan"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Tài khoản
                  </Link>
                  <Link
                    to="/don-hang"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Đơn hàng của tôi
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/dang-nhap"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              >
                <FiUser size={24} />
                <span className="hidden md:block">Đăng nhập</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      {categories.length > 0 && (
        <div className="bg-white border-t hidden lg:block">
          <div className="container-custom">
            <nav className="flex items-center gap-1 py-2 overflow-x-auto">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(category._id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={`/danh-muc/${category.slug}`}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 whitespace-nowrap"
                  >
                    <span>{category.name}</span>
                    {category.children && category.children.length > 0 && (
                      <FiChevronDown size={14} />
                    )}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container-custom py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-blue-600 rounded-full focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {categories.length > 0 && (
                <div className="border-t pt-2 mt-2">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/danh-muc/${category.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
