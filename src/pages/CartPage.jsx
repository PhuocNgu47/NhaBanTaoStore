import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingCart, FiChevronRight, FiTruck, FiRefreshCw, FiAward, FiCreditCard } from 'react-icons/fi';
import { useCart } from '../hooks';
import { formatPrice } from '../utils/helpers';
import Modal from '../components/Modal';

// Checkout steps component
const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Giỏ hàng', icon: FiShoppingCart },
    { id: 2, name: 'Thông tin đặt hàng', icon: FiShoppingCart },
    { id: 3, name: 'Hoàn tất', icon: FiShoppingCart },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.id <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`font-medium ${
                step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-24 h-0.5 mx-4 ${
                step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              style={{ borderStyle: 'dashed', borderWidth: '1px', borderColor: step.id < currentStep ? '#2563eb' : '#e5e7eb' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const CartPage = () => {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const [selectedItems, setSelectedItems] = useState(items.map((item) => `${item.id}-${item.variant}`));
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);

  const toggleSelectItem = (itemKey) => {
    setSelectedItems((prev) =>
      prev.includes(itemKey)
        ? prev.filter((key) => key !== itemKey)
        : [...prev, itemKey]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => `${item.id}-${item.variant}`));
    }
  };

  const selectedTotal = items
    .filter((item) => selectedItems.includes(`${item.id}-${item.variant}`))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openVoucherModal = () => {
    setVoucherModalOpen(true);
  };

  const closeVoucherModal = () => {
    setVoucherModalOpen(false);
  };

  if (items.length === 0) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h1>
          <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link
            to="/san-pham"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            <FiArrowLeft />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          <span className="hover:text-blue-600 cursor-pointer">🏠 Trang chủ</span>
          <span className="mx-2">›</span>
          <span className="font-semibold text-gray-900">Giỏ hàng</span>
        </div>

        {/* Checkout Steps */}
        <CheckoutSteps currentStep={1} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All Header */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === items.length}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-800">Chọn tất cả</span>
                  <span className="text-red-500">( {items.length} sản phẩm)</span>
                </label>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <FiTrash2 />
                  <span>Xóa</span>
                </button>
              </div>
            </div>

            {/* Cart Items */}
            {items.map((item) => {
              const itemKey = `${item.id}-${item.variant}`;
              return (
                <div key={itemKey} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex gap-4">
                    {/* Checkbox */}
                    <div className="flex items-start pt-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(itemKey)}
                        onChange={() => toggleSelectItem(itemKey)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    {/* Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800 hover:text-blue-600 cursor-pointer">
                            {item.name}
                          </h3>
                          {item.variant && (
                            <div className="flex gap-2 mt-2">
                              {item.variant.split(' - ').map((v, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200"
                                >
                                  {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.variant)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <p className="text-red-600 font-bold text-lg">
                            {formatPrice(item.price)}
                          </p>
                          <p className="text-gray-400 text-sm line-through">
                            {formatPrice(item.price * 1.2)}
                          </p>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 font-bold"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="w-12 h-10 flex items-center justify-center font-semibold border-x-2 border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Login Tip */}
            <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
              <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-lg">
                Mẹo nhỏ
              </span>
              <p className="text-gray-700">
                <Link to="/dang-nhap" className="text-blue-600 font-semibold hover:underline">
                  Đăng nhập
                </Link>{' '}
                nhẹ nhàng để được ưu tiên freeship, tracking đơn trong một nốt nhạc
              </p>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-blue-900 mb-6 uppercase">
                Thông tin thanh toán
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="text-xl font-bold text-red-600">
                    {formatPrice(selectedTotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-4 border-y border-gray-200">
                  <span className="text-gray-600">Voucher khuyến mãi</span>
                  <button 
                    onClick={openVoucherModal}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                  >
                    <span>Chọn hoặc nhập mã</span>
                    <FiChevronRight />
                  </button>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-800 font-semibold">Tổng thanh toán:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(selectedTotal)}
                  </span>
                </div>
              </div>

              <Link
                to="/thanh-toan"
                className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-4 rounded-xl font-bold text-lg mt-6 transition-all shadow-lg hover:shadow-xl uppercase"
              >
                Đi đến thanh toán
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <FiRefreshCw className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-blue-900 uppercase">Hoàn trả miễn phí</p>
              <p className="text-sm text-gray-500">Miễn phí trả hàng trong 7 ngày</p>
              <p className="text-sm text-gray-400">(trừ chính hãng Apple)</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
              <FiAward className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-blue-900 uppercase">Cam kết chính hãng</p>
              <p className="text-sm text-gray-500">Hoàn tiền gấp đôi</p>
              <p className="text-sm text-gray-400">nếu phát hiện hàng giả</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
              <FiTruck className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <p className="font-bold text-blue-900 uppercase">Freeship toàn quốc</p>
              <p className="text-sm text-gray-500">Freeship cho đơn từ 300K khi</p>
              <p className="text-sm text-gray-400">thanh toán trước</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiCreditCard className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-blue-900 uppercase">Hỗ trợ trả góp</p>
              <p className="text-sm text-gray-500">Trả góp qua thẻ tín dụng</p>
              <p className="text-sm text-gray-400">& qua app Krevido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Modal */}
      <Modal open={voucherModalOpen} onClose={closeVoucherModal} title="Chọn Voucher Khuyến Mãi">
        <div className="space-y-4">
          <p className="text-gray-600">Chọn một voucher để áp dụng cho đơn hàng của bạn:</p>
          <div className="space-y-2">
            {/* Placeholder for available vouchers - you can replace with actual data */}
            <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
              <div className="font-medium">VOUCHER10</div>
              <div className="text-sm text-gray-600">Giảm 10% cho đơn hàng từ 500k</div>
            </div>
            <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
              <div className="font-medium">FREESHIP</div>
              <div className="text-sm text-gray-600">Miễn phí vận chuyển</div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={closeVoucherModal}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartPage;
