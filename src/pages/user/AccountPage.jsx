import { useAuth } from '../../hooks';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2 } from 'react-icons/fi';

const AccountPage = () => {
  const { user } = useAuth();

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tài khoản của tôi</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-4xl text-blue-600 font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="font-bold text-gray-800">{user?.name || 'Người dùng'}</h2>
              <p className="text-gray-500 text-sm">{user?.email || 'email@example.com'}</p>
              <button className="mt-4 text-blue-600 text-sm font-medium flex items-center gap-1 mx-auto">
                <FiEdit2 size={14} />
                Chỉnh sửa ảnh
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Thông tin cá nhân</h3>
                <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
                  <FiEdit2 size={14} />
                  Chỉnh sửa
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="font-medium">{user?.name || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiMail className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiPhone className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{user?.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Địa chỉ giao hàng</h3>
                <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
                  <FiEdit2 size={14} />
                  Thêm địa chỉ
                </button>
              </div>

              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">Địa chỉ mặc định</p>
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">
                      Mặc định
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {user?.address || '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh'}
                  </p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Bảo mật</h3>
              
              <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center">
                <span>Đổi mật khẩu</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
