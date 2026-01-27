
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiLoader, FiGlobe, FiTruck, FiCreditCard, FiDollarSign, FiShare2, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi'; // ADDED ICONS
import settingsService from '../../services/settingsService';

const AdminSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // VietQR Banks List
  const [vietQrBanks, setVietQrBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  // New Bank Form State
  const [newBank, setNewBank] = useState({
    bin: '',
    bankNumber: '',
    bankHolder: '',
  });

  // State cho các cài đặt
  const [settings, setSettings] = useState({
    // Cài đặt chung
    siteName: '',
    siteDescription: '',
    email: '',
    phone: '',
    hotline: '',
    address: '',
    maintenanceMode: false,

    // Social media
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    zalo: '',

    // Vận chuyển
    freeShipThreshold: 300000,
    defaultShippingFee: 30000,

    // Thanh toán
    payment: {
      cod: true,
      bankTransfer: true,
      momo: {
        enabled: false,
        phoneNumber: '',
        accountHolder: '',
        qrCode: ''
      },
      vnpay: false,
    },

    // Ngân hàng (Danh sách)
    banks: [], // Changed from bankInfo object to banks array
  });

  // Load settings khi mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Load VietQR banks list when switching to 'bank' tab
  useEffect(() => {
    if (activeTab === 'bank' && vietQrBanks.length === 0) {
      fetchVietQrBanks();
    }
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getAdminSettings();
      if (response.success) {
        // Map old structure to new if necessary, or just use response
        // Note: Backend might return old structure if database not migrated, handle carefully
        const fetchedSettings = response.settings;

        // Ensure banks is array
        if (!Array.isArray(fetchedSettings.banks)) {
          fetchedSettings.banks = [];
        }

        // Ensure payment object structure
        if (!fetchedSettings.payment) {
          fetchedSettings.payment = {
            cod: fetchedSettings.paymentMethods?.cod || true,
            bankTransfer: fetchedSettings.paymentMethods?.bankTransfer || true,
            momo: { enabled: false, phoneNumber: '', accountHolder: '' },
            vnpay: false
          };
        }

        setSettings(prev => ({
          ...prev,
          ...fetchedSettings,
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Không thể tải cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const fetchVietQrBanks = async () => {
    try {
      setLoadingBanks(true);
      const response = await fetch('https://api.vietqr.io/v2/banks');
      const data = await response.json();
      if (data.code === '00') {
        setVietQrBanks(data.data);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast.error('Không thể tải danh sách ngân hàng');
    } finally {
      setLoadingBanks(false);
    }
  };

  // Handle input change
  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle Payment Toggle/Change
  const handlePaymentChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        [field]: value
      }
    }));
  };

  // Handle MoMo details change
  const handleMomoChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        momo: {
          ...prev.payment.momo,
          [field]: value
        }
      }
    }));
  };

  // --- Bank Management ---

  const handleBsankInputChange = (field, value) => {
    setNewBank(prev => ({ ...prev, [field]: value }));
  }

  const handleAddBank = () => {
    if (!newBank.bin || !newBank.bankNumber || !newBank.bankHolder) {
      toast.error('Vui lòng điền đầy đủ thông tin ngân hàng');
      return;
    }

    const selectedBank = vietQrBanks.find(b => b.bin === newBank.bin);
    if (!selectedBank) return;

    const bankToAdd = {
      bin: selectedBank.bin,
      shortName: selectedBank.shortName,
      bankName: selectedBank.name,
      logo: selectedBank.logo,
      bankNumber: newBank.bankNumber,
      bankHolder: newBank.bankHolder.toUpperCase(),
      isDefault: settings.banks.length === 0 // First bank is default
    };

    setSettings(prev => ({
      ...prev,
      banks: [...prev.banks, bankToAdd]
    }));

    // Reset form
    setNewBank({ bin: '', bankNumber: '', bankHolder: '' });
    toast.success('Đã thêm tài khoản ngân hàng');
  };

  const handleRemoveBank = (index) => {
    setSettings(prev => {
      const newBanks = [...prev.banks];
      newBanks.splice(index, 1);
      return { ...prev, banks: newBanks };
    });
  };

  const handleSetDefaultBank = (index) => {
    setSettings(prev => {
      const newBanks = prev.banks.map((b, i) => ({
        ...b,
        isDefault: i === index
      }));
      return { ...prev, banks: newBanks };
    });
  };

  // --- Save Logic ---

  const handleSave = async () => {
    try {
      setSaving(true);
      // Clean up data before sending if needed
      const response = await settingsService.updateSettings(settings);
      if (response.success) {
        toast.success('Đã lưu cài đặt thành công!');
      } else {
        toast.error(response.message || 'Lỗi khi lưu cài đặt');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Không thể lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSection = async (section) => {
    // Logic save section tương tự, nhưng cần map đúng field mới
    // Để đơn giản, ở đây mình gọi updateSettings full luôn cho chắc, hoặc update partial
    // Với cấu trúc mới, tốt nhất là send full object hoặc partial đúng field
    try {
      setSaving(true);
      let data = {};

      if (section === 'payment') data = { payment: settings.payment };
      else if (section === 'bank') data = { banks: settings.banks };
      else if (section === 'general') data = { siteName: settings.siteName, siteDescription: settings.siteDescription, maintenanceMode: settings.maintenanceMode };
      else if (section === 'contact') data = { email: settings.email, phone: settings.phone, hotline: settings.hotline, address: settings.address };
      else if (section === 'social') data = { facebook: settings.facebook, instagram: settings.instagram, youtube: settings.youtube, tiktok: settings.tiktok, zalo: settings.zalo };
      else if (section === 'shipping') data = { freeShipThreshold: settings.freeShipThreshold, defaultShippingFee: settings.defaultShippingFee };

      // Use updateSection endpoint (backend needs to handle new fields map)
      // Or just use generic update
      const response = await settingsService.updateSection(section, data);
      if (response.success) {
        toast.success(response.message || 'Đã lưu thành công!');
      }
    } catch (error) {
      toast.error('Lỗi lưu section');
    } finally {
      setSaving(false);
    }
  };


  const tabs = [
    { id: 'general', label: 'Cài đặt chung', icon: FiGlobe },
    { id: 'social', label: 'Mạng xã hội', icon: FiShare2 },
    { id: 'shipping', label: 'Vận chuyển', icon: FiTruck },
    { id: 'payment', label: 'Thanh toán', icon: FiCreditCard },
    { id: 'bank', label: 'Ngân hàng', icon: FiDollarSign },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiSave />
          )}
          Lưu tất cả
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Cài đặt chung */}
        {activeTab === 'general' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Cài đặt chung</h2>
              <button onClick={() => handleSaveSection('general')} className="btn-save-section">Lưu phần này</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Tên website</label>
                <input type="text" className="input-field" value={settings.siteName} onChange={(e) => handleChange('siteName', e.target.value)} />
              </div>
              <div>
                <label className="label">Email liên hệ</label>
                <input type="email" className="input-field" value={settings.email} onChange={(e) => handleChange('email', e.target.value)} />
              </div>
              <div>
                <label className="label">Số điện thoại</label>
                <input type="text" className="input-field" value={settings.phone} onChange={(e) => handleChange('phone', e.target.value)} />
              </div>
              <div>
                <label className="label">Hotline</label>
                <input type="text" className="input-field" value={settings.hotline} onChange={(e) => handleChange('hotline', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Mô tả website</label>
                <textarea className="input-field" rows={2} value={settings.siteDescription} onChange={(e) => handleChange('siteDescription', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Địa chỉ</label>
                <textarea className="input-field" rows={2} value={settings.address} onChange={(e) => handleChange('address', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => handleChange('maintenanceMode', e.target.checked)} className="checkbox" />
                  <span className="font-medium text-gray-800">Chế độ bảo trì</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Mạng xã hội */}
        {activeTab === 'social' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Liên kết mạng xã hội</h2>
              <button onClick={() => handleSaveSection('social')} className="btn-save-section">Lưu phần này</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['facebook', 'instagram', 'youtube', 'tiktok'].map(social => (
                <div key={social}>
                  <label className="label capitalize">{social}</label>
                  <input type="url" className="input-field" value={settings[social]} onChange={(e) => handleChange(social, e.target.value)} placeholder={`https://${social}.com/...`} />
                </div>
              ))}
              <div>
                <label className="label">Zalo</label>
                <input type="text" className="input-field" value={settings.zalo} onChange={(e) => handleChange('zalo', e.target.value)} placeholder="Số điện thoại Zalo" />
              </div>
            </div>
          </div>
        )}

        {/* Vận chuyển */}
        {activeTab === 'shipping' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Cài đặt vận chuyển</h2>
              <button onClick={() => handleSaveSection('shipping')} className="btn-save-section">Lưu phần này</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Miễn phí vận chuyển từ (VNĐ)</label>
                <input type="number" className="input-field" value={settings.freeShipThreshold} onChange={(e) => handleChange('freeShipThreshold', parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="label">Phí vận chuyển mặc định (VNĐ)</label>
                <input type="number" className="input-field" value={settings.defaultShippingFee} onChange={(e) => handleChange('defaultShippingFee', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>
        )}

        {/* Thanh toán */}
        {activeTab === 'payment' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Phương thức thanh toán</h2>
              <button onClick={() => handleSaveSection('payment')} className="btn-save-section">Lưu phần này</button>
            </div>
            <div className="space-y-6">
              {/* Payment Methods Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" checked={settings.payment?.cod} onChange={(e) => handlePaymentChange('cod', e.target.checked)} className="checkbox" />
                  <span className="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" checked={settings.payment?.bankTransfer} onChange={(e) => handlePaymentChange('bankTransfer', e.target.checked)} className="checkbox" />
                  <span className="font-medium text-gray-800">Chuyển khoản ngân hàng</span>
                </label>
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" checked={settings.payment?.vnpay} onChange={(e) => handlePaymentChange('vnpay', e.target.checked)} className="checkbox" />
                  <span className="font-medium text-gray-800">VNPay (Simulation)</span>
                </label>
              </div>

              {/* MoMo Config */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-pink-600">Cấu hình Ví MoMo</h3>
                  <label className="switch flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={settings.payment?.momo?.enabled} onChange={(e) => handleMomoChange('enabled', e.target.checked)} className="w-5 h-5 accent-pink-600" />
                    <span className="text-gray-700 font-medium">Kích hoạt</span>
                  </label>
                </div>

                {settings.payment?.momo?.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-pink-50 p-4 rounded-xl border border-pink-100">
                    <div>
                      <label className="label">Số điện thoại Ví MoMo</label>
                      <input
                        type="text"
                        className="input-field border-pink-200 focus:ring-pink-500"
                        value={settings.payment.momo?.phoneNumber || ''}
                        onChange={(e) => handleMomoChange('phoneNumber', e.target.value)}
                        placeholder="09xxx..."
                      />
                    </div>
                    <div>
                      <label className="label">Tên chủ Ví</label>
                      <input
                        type="text"
                        className="input-field border-pink-200 focus:ring-pink-500"
                        value={settings.payment.momo?.accountHolder || ''}
                        onChange={(e) => handleMomoChange('accountHolder', e.target.value)}
                        placeholder="NGUYEN VAN A"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Ngân hàng */}
        {activeTab === 'bank' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Quản lý tài khoản ngân hàng</h2>
              <button onClick={() => handleSaveSection('bank')} className="btn-save-section">Lưu danh sách</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form thêm ngân hàng */}
              <div className="lg:col-span-1 border-r pr-0 lg:pr-8 border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <FiPlus className="bg-blue-100 text-blue-600 rounded p-1 box-content" /> Thêm tài khoản mới
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Chọn ngân hàng</label>
                    <select
                      className="input-field"
                      value={newBank.bin}
                      onChange={(e) => setNewBank({ ...newBank, bin: e.target.value })}
                      disabled={loadingBanks}
                    >
                      <option value="">-- Chọn ngân hàng --</option>
                      {vietQrBanks.map(bank => (
                        <option key={bank.id} value={bank.bin}>
                          {bank.shortName} - {bank.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Số tài khoản</label>
                    <input
                      type="text"
                      className="input-field"
                      value={newBank.bankNumber}
                      onChange={(e) => setNewBank({ ...newBank, bankNumber: e.target.value })}
                      placeholder="Nhập số tài khoản..."
                    />
                  </div>
                  <div>
                    <label className="label">Tên chủ tài khoản</label>
                    <input
                      type="text"
                      className="input-field uppercase"
                      value={newBank.bankHolder}
                      onChange={(e) => setNewBank({ ...newBank, bankHolder: e.target.value })}
                      placeholder="NGUYEN VAN A"
                    />
                  </div>
                  <button
                    onClick={handleAddBank}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Thêm tài khoản
                  </button>
                </div>
              </div>

              {/* Danh sách ngân hàng */}
              <div className="lg:col-span-2">
                <h3 className="font-bold text-gray-700 mb-4">Danh sách tài khoản ({settings.banks?.length || 0})</h3>

                {settings.banks?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
                    Chưa có tài khoản ngân hàng nào.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {settings.banks?.map((bank, index) => (
                      <div key={index} className="relative p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition bg-white shadow-sm group">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-white shadow p-1 border">
                            {bank.logo && <img src={bank.logo} alt={bank.shortName} className="w-full h-full object-contain" />}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{bank.shortName}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{bank.bankName}</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-mono font-bold text-blue-700 tracking-wide">{bank.bankNumber}</div>
                          <div className="text-sm font-semibold text-gray-600 uppercase">{bank.bankHolder}</div>
                        </div>

                        {/* Actions */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleRemoveBank(index)}
                            className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            title="Xóa"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                        {bank.isDefault && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full group-hover:opacity-0 transition">Default</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .label {
            @apply block text-sm font-medium text-gray-700 mb-1;
        }
        .input-field {
            @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none;
        }
        .btn-save-section {
            @apply px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition;
        }
        .checkbox {
            @apply w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500;
        }
      `}</style>
    </div>
  );
};

export default AdminSettingsPage;
