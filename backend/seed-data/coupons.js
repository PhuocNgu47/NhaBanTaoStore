/**
 * Seed Data - Coupons
 * 
 * Mã giảm giá mẫu cho e-commerce
 */

// 30 ngày từ hôm nay
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 30);

// 7 ngày trước (expired)
const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 7);

export const COUPONS = [
  {
    code: 'WELCOME10',
    name: 'Chào mừng khách hàng mới',
    description: 'Giảm 10% cho đơn hàng đầu tiên',
    discountType: 'percentage',
    discountValue: 10,
    minPurchaseAmount: 5000000,
    maxDiscountAmount: 2000000,
    usageLimit: 100,
    usedCount: 0,
    validFrom: new Date(),
    validUntil: futureDate,
    isActive: true,
    applicableCategories: [],
    applicableProducts: []
  },
  {
    code: 'IPAD500K',
    name: 'Ưu đãi iPad',
    description: 'Giảm 500.000đ khi mua iPad',
    discountType: 'fixed',
    discountValue: 500000,
    minPurchaseAmount: 10000000,
    maxDiscountAmount: 500000,
    usageLimit: 50,
    usedCount: 0,
    validFrom: new Date(),
    validUntil: futureDate,
    isActive: true,
    applicableCategories: ['ipad'],
    applicableProducts: []
  },
  {
    code: 'MACBOOK1M',
    name: 'Ưu đãi MacBook',
    description: 'Giảm 1.000.000đ khi mua MacBook',
    discountType: 'fixed',
    discountValue: 1000000,
    minPurchaseAmount: 20000000,
    maxDiscountAmount: 1000000,
    usageLimit: 30,
    usedCount: 0,
    validFrom: new Date(),
    validUntil: futureDate,
    isActive: true,
    applicableCategories: ['macbook'],
    applicableProducts: []
  },
  {
    code: 'FREESHIP',
    name: 'Miễn phí vận chuyển',
    description: 'Miễn phí vận chuyển đơn từ 3 triệu',
    discountType: 'fixed',
    discountValue: 30000,
    minPurchaseAmount: 3000000,
    maxDiscountAmount: 30000,
    usageLimit: null,
    usedCount: 0,
    validFrom: new Date(),
    validUntil: futureDate,
    isActive: true,
    applicableCategories: [],
    applicableProducts: []
  },
  {
    code: 'SUMMER2024',
    name: 'Khuyến mãi hè 2024',
    description: 'Giảm 15% tất cả sản phẩm',
    discountType: 'percentage',
    discountValue: 15,
    minPurchaseAmount: 8000000,
    maxDiscountAmount: 3000000,
    usageLimit: 200,
    usedCount: 45,
    validFrom: new Date(),
    validUntil: futureDate,
    isActive: true,
    applicableCategories: [],
    applicableProducts: []
  },
  {
    code: 'EXPIRED20',
    name: 'Mã đã hết hạn',
    description: 'Mã giảm giá đã hết hạn (test)',
    discountType: 'percentage',
    discountValue: 20,
    minPurchaseAmount: 5000000,
    maxDiscountAmount: 2000000,
    usageLimit: 100,
    usedCount: 0,
    validFrom: pastDate,
    validUntil: pastDate,
    isActive: false,
    applicableCategories: [],
    applicableProducts: []
  }
];
