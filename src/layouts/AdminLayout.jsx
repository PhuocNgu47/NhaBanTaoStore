import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  FiHome,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
  FiBarChart2,
  FiTag,
} from 'react-icons/fi';
import { useAuth } from '../hooks';

const menuItems = [
  { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
  { path: '/admin/san-pham', icon: FiBox, label: 'Sản phẩm' },
  { path: '/admin/danh-muc', icon: FiTag, label: 'Danh mục' },
  { path: '/admin/don-hang', icon: FiShoppingBag, label: 'Đơn hàng' },
  { path: '/admin/nguoi-dung', icon: FiUsers, label: 'Người dùng' },
  { path: '/admin/thong-ke', icon: FiBarChart2, label: 'Thống kê' },
  { path: '/admin/cai-dat', icon: FiSettings, label: 'Cài đặt' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <span className="font-bold text-blue-600">Admin Panel</span>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside
          className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          {/* Logo */}
          <div className="p-4 border-b flex items-center justify-between">
            {sidebarOpen && (
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🍎</span>
                </div>
                <span className="font-bold text-gray-800">Admin</span>
              </Link>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <FiMenu size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                  isActive(item.path, item.exact)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              {sidebarOpen && (
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-500">Admin</p>
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className={`mt-3 flex items-center gap-2 text-red-600 hover:text-red-700 ${
                sidebarOpen ? '' : 'justify-center w-full'
              }`}
            >
              <FiLogOut size={18} />
              {sidebarOpen && <span>Đăng xuất</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg">
              <div className="p-4 border-b">
                <Link to="/admin" className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">🍎</span>
                  </div>
                  <span className="font-bold text-gray-800">Admin Panel</span>
                </Link>
              </div>

              <nav className="py-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                      isActive(item.path, item.exact)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <FiLogOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
          }`}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
