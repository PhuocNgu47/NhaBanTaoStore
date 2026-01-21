// API Base URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  INSTALLMENT: 'installment',
};

// Categories
export const CATEGORIES = [
  { id: 'ipad', name: 'iPad', icon: 'tablet' },
  { id: 'macbook', name: 'MacBook', icon: 'laptop' },
  { id: 'audio', name: 'Âm thanh', icon: 'headphones' },
  { id: 'apple-accessories', name: 'Phụ kiện Apple', icon: 'box' },
  { id: 'ipad-accessories', name: 'Phụ kiện iPad', icon: 'keyboard' },
  { id: 'stylus', name: 'Bút cảm ứng', icon: 'pen' },
  { id: 'other-accessories', name: 'Phụ kiện khác', icon: 'grid' },
];

// Navigation Links
export const NAV_LINKS = [
  { path: '/tra-cuu-don-hang', label: 'Tra cứu đơn hàng' },
  { path: '/goc-cong-nghe', label: 'Góc công nghệ' },
  { path: '/cua-hang', label: 'Cửa hàng' },
  { path: '/lien-he', label: 'Liên hệ' },
];

// Features/Benefits
export const FEATURES = [
  {
    icon: 'return',
    title: 'HOÀN TRẢ MIỄN PHÍ',
    description: 'Miễn phí trả hàng trong 7 ngày (trừ chính hãng Apple)',
  },
  {
    icon: 'authentic',
    title: 'CAM KẾT CHÍNH HÃNG',
    description: 'Hoàn tiền gấp đôi nếu phát hiện hàng giả',
  },
  {
    icon: 'freeship',
    title: 'FREESHIP TOÀN QUỐC',
    description: 'Freeship cho đơn từ 300K khi thanh toán trước',
  },
  {
    icon: 'installment',
    title: 'HỖ TRỢ TRẢ GÓP',
    description: 'Trả góp qua thẻ tín dụng & qua app Krevido',
  },
];
