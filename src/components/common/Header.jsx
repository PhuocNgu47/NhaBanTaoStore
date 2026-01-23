import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown, FiHeart, FiStar, FiPackage } from 'react-icons/fi';
import { useAuth, useCart } from '../../hooks';
import { CATEGORIES, NAV_LINKS } from '../../constants';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isAuthenticated, user, logout, isAdmin, loading } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <header className="h-[72px] bg-white border-b" />
    );
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-sm shadow-gray-200/20 sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
      {/* Top Header */}
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo Apple - ĐÃ FIX: Thêm opacity-100 để không bị mờ */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group hover-lift transition-all duration-300"
          >
            <div className="relative w-12 h-12 bg-gradient-to-br from-[#8EE4AF] to-[#5CDB95] rounded-full flex items-center justify-center shadow-lg shadow-[#8EE4AF]/30 group-hover:shadow-xl group-hover:shadow-[#8EE4AF]/40 transition-all duration-300">
              <svg
                  viewBox="0 0 256 315"
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                >
                  <path 
                    d="M214 167c0 48 42 63 42 64s-7 22-22 44c-13 20-26 39-48 39-21 0-28-12-52-12s-31 12-52 12c-21 0-35-20-48-39-27-39-48-111-20-159 14-24 39-39 65-39 21 0 39 14 52 14 13 0 34-14 56-14 18 0 46 6 67 38-2 3-34 20-34 60zm-49-118c0-18 7-41 20-56 12-15 29-26 48-26 2 0 6 1 9 2-2 13-8 26-18 37-10 11-22 20-37 24-3 1-7 2-10 2-3 0-7-1-10-2-2-1-4-2-2-3z"
                    fill="white"
                  />
                </svg>

              {/* glow - ĐÃ FIX: Giảm opacity để không làm mờ logo */}
              <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-[#8EE4AF]/10 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-full"></div>
            </div>

            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-[#379683] via-[#5CDB95] to-[#907163] bg-clip-text text-transparent">
                NHÀ BÁN TÁO STORE
              </span>
              <p className="text-xs text-gray-500 mt-0.5">Apple Premium Reseller</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8"> 
            <div className="relative w-full max-w-xl mx-auto"> 
              <input
                type="text"
                placeholder="Tìm kiếm iPhone, MacBook, iPad, AirPods, Apple Watch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 bg-[#EDF5E1]/30 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8EE4AF] focus:border-[#5CDB95] transition-all duration-300 placeholder:text-gray-400 text-gray-700 shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#379683] transition-colors duration-300"
              >
                <FiSearch size={20} />
              </button>
              <div className="pointer-events-none absolute -inset-0.5 bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] rounded-full opacity-0 group-focus-within:opacity-30 blur transition-opacity duration-300"></div>
            </div>
          </form>

          {/* Navigation Links - TẤT CẢ DÙNG CHUNG MÀU #379683 */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-gray-700 hover:text-[#379683] font-medium transition-colors duration-300"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#379683] to-[#5CDB95] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            {/* Wishlist button với màu #907163 */}
            <Link to="/yeu-thich" className="p-2 text-gray-600 hover:text-[#907163] transition-colors duration-300 relative group">
              <FiHeart size={22} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#907163] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart với màu #379683 */}
            <Link to="/gio-hang" className="relative p-3 text-gray-700 hover:text-[#379683] group transition-colors duration-300">
              <div className="relative">
                <FiShoppingCart size={24} />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#8EE4AF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-[#379683]/40 animate-subtle-pulse">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User section với gradient #379683 và #5CDB95 */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-3 p-2 text-gray-700 hover:text-[#379683] transition-colors duration-300 group">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#379683] to-[#5CDB95] rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#8EE4AF] rounded-full border-2 border-white"></div>
                  </div>
                  <span className="hidden md:block font-medium">{user?.name}</span>
                  <FiChevronDown size={16} className="text-gray-400 group-hover:text-[#379683] transition-colors" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl shadow-gray-400/20 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#EDF5E1] to-white/50">
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/tai-khoan"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#EDF5E1] rounded-lg transition-colors duration-200 group hover:text-[#379683]"
                    >
                      <FiUser size={18} className="text-[#379683]" />
                      <span>Tài khoản của tôi</span>
                      <span className="ml-auto text-[#379683] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                    <Link
                      to="/don-hang"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#EDF5E1] rounded-lg transition-colors duration-200 group hover:text-[#379683]"
                    >
                      <FiPackage size={18} className="text-[#379683]" />
                      <span>Đơn hàng của tôi</span>
                      <span className="ml-auto text-[#379683] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                    <Link
                      to="/yeu-thich"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#EDF5E1] rounded-lg transition-colors duration-200 group hover:text-[#907163]"
                    >
                      <FiHeart size={18} className="text-[#907163]" />
                      <span>Sản phẩm yêu thích</span>
                      <span className="ml-auto text-[#907163] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#EDF5E1] rounded-lg transition-colors duration-200 border-t border-gray-100 mt-2 pt-2 group hover:text-[#5CDB95]"
                      >
                        <div className="w-5 h-5 bg-gradient-to-r from-[#5CDB95] to-[#379683] rounded flex items-center justify-center text-white text-xs font-bold">
                          A
                        </div>
                        <span>Quản trị viên</span>
                        <span className="ml-auto text-[#5CDB95] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[#907163] hover:bg-[#EDF5E1] rounded-lg transition-colors duration-200 border-t border-gray-100 mt-2 pt-2 group"
                    >
                      <div className="w-5 h-5 rounded-full border border-[#907163]/30 flex items-center justify-center">
                        <span className="text-[#907163]">→</span>
                      </div>
                      <span>Đăng xuất</span>
                      <span className="ml-auto text-[#907163] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/dang-nhap"
                className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white rounded-full font-medium shadow-md"
              >
                <FiUser size={18} />
                <span className="hidden md:block">Đăng nhập</span>
              </Link>
            )}

            {/* Mobile Menu Toggle với màu #5CDB95 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 text-gray-700 hover:text-[#5CDB95] transition-colors duration-300 relative group"
            >
              {isMenuOpen ? (
                <FiX size={24} className="transform transition-transform duration-300 rotate-180" />
              ) : (
                <FiMenu size={24} className="transform transition-transform duration-300" />
              )}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#8EE4AF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation - TẤT CẢ DÙNG CHUNG MÀU #907163 */}
      <div className="bg-gradient-to-r from-white via-[#EDF5E1]/40 to-white border-t border-gray-100 hidden lg:block">
        <div className="container-custom">
          <nav className="flex items-center justify-between py-3">
            <div className="flex items-center gap-0 w-full justify-between">
              {CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className="relative group flex-1 text-center"
                  onMouseEnter={() => setActiveDropdown(category.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={`/danh-muc/${category.id}`}
                    className="flex items-center justify-center gap-1 px-2 py-2.5 text-gray-700 whitespace-nowrap transition-all duration-300 hover:text-[#907163] hover:bg-[#907163]/10 border-l-0 hover:border-l-4 border-[#907163] group"
                  >
                    <span className="font-medium text-sm">{category.name}</span>
                    <FiChevronDown 
                      size={12} 
                      className={`transform transition-transform duration-300 ${activeDropdown === category.id ? 'rotate-180' : ''}`}
                    />
                  </Link>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#907163] transition-all duration-300 group-hover:w-3/4"></div>
                </div>
              ))}
            </div>
            {/* Promo badge với gradient #8EE4AF và #EDF5E1 */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#8EE4AF] to-[#EDF5E1] rounded-full text-gray-800 text-sm font-medium shadow-sm ml-4 border border-[#8EE4AF]/30">
              <FiStar size={14} className="text-[#379683]" />
              <span className="font-semibold">Miễn phí giao hàng</span>
              <span className="text-xs bg-white/50 px-1.5 py-0.5 rounded text-[#379683] font-bold">2tr+</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu với background #EDF5E1 */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-white to-[#EDF5E1] backdrop-blur-md border-t animate-fadeInUp">
          <div className="container-custom py-6">
            {/* Mobile Search - ĐÃ FIX: Giữ nguyên vì trên mobile ổn */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8EE4AF] focus:border-[#5CDB95] transition-all duration-300 placeholder:text-gray-400 text-gray-700 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#379683] transition-colors duration-300"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>

            {/* Mobile Navigation - TẤT CẢ DÙNG MÀU #379683 */}
            <nav className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center justify-between px-4 py-3.5 text-gray-700 hover:bg-white rounded-xl transition-all duration-300 border-l-4 border-transparent hover:border-[#379683] hover:text-[#379683] group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <div className="w-7 h-7 rounded-full bg-[#379683]/10 flex items-center justify-center text-[#379683] text-xs">
                    →
                  </div>
                </Link>
              ))}
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                <p className="px-4 text-sm font-semibold text-[#907163] mb-2">DANH MỤC</p>
                <div className="space-y-1">
                  {CATEGORIES.map((category) => (
                    <Link
                      key={category.id}
                      to={`/danh-muc/${category.id}`}
                      className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-white rounded-lg transition-colors duration-300 group border-l-4 border-transparent hover:border-[#907163] hover:text-[#907163]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{category.name}</span>
                      <div className="w-6 h-6 rounded-full bg-[#907163]/10 flex items-center justify-center text-[#907163] text-xs">
                        →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile auth section với gradient #EDF5E1 */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 bg-gradient-to-r from-[#EDF5E1] to-white rounded-xl mb-3 border border-[#8EE4AF]/30">
                      <p className="font-semibold text-[#379683]">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[#907163] hover:bg-[#EDF5E1] rounded-xl transition-colors duration-300 border border-[#907163]/20"
                    >
                      <FiUser size={18} />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link
                    to="/dang-nhap"
                    className="block w-full text-center px-4 py-3.5 bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white rounded-xl hover:shadow-lg hover:shadow-[#379683]/40 transition-all duration-300 font-medium shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập / Đăng ký
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;