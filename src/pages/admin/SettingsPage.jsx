import { useState } from 'react';
import { toast } from 'react-toastify';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: 'Nhà Bán Táo Store',
    email: 'info@anhphibantao.com',
    phone: '0123 456 789',
    address: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
    freeShipThreshold: 300000,
    currency: 'VND',
  });

  const handleSave = () => {
    toast.success('Đã lưu cài đặt!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cài đặt</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Cài đặt chung</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên website
              </label>
              <input
                type="text"
                className="input-field"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email liên hệ
              </label>
              <input
                type="email"
                className="input-field"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                className="input-field"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <textarea
                className="input-field"
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Cài đặt vận chuyển</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miễn phí vận chuyển từ (VNĐ)
              </label>
              <input
                type="number"
                className="input-field"
                value={settings.freeShipThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShipThreshold: parseInt(e.target.value) })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                Đơn hàng từ {settings.freeShipThreshold.toLocaleString('vi-VN')}đ sẽ được miễn phí vận chuyển
              </p>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Cài đặt thanh toán</h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Cho phép thanh toán khi nhận hàng (COD)</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Cho phép chuyển khoản ngân hàng</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Cho phép trả góp</span>
              </label>
            </div>
          </div>
        </div>

        {/* Bank Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin ngân hàng</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên ngân hàng
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="VD: Vietcombank"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số tài khoản
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="VD: 1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chủ tài khoản
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="VD: NGUYEN VAN A"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Lưu cài đặt
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
