import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🍎</span>
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">Nhà Bán Táo Store</h1>
          <p className="text-gray-600">Chính hãng Apple</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2026 Nhà Bán Táo Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
