/**
 * Seed Orders
 * Tạo orders mẫu với variants support
 */

import Order from '../models/Order.js';

// Generate order number
const generateOrderNumber = () => {
  const now = Date.now();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${now}${rand}`;
};

// Sample addresses for orders
const sampleAddresses = [
  {
    addressLine1: '123 Nguyễn Huệ',
    ward: 'Phường Bến Nghé',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    country: 'Vietnam',
    zipCode: '700000'
  },
  {
    addressLine1: '456 Lê Lợi',
    ward: 'Phường Bến Thành',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    country: 'Vietnam',
    zipCode: '700000'
  },
  {
    addressLine1: '789 Điện Biên Phủ',
    ward: 'Phường 25',
    district: 'Bình Thạnh',
    city: 'Hồ Chí Minh',
    country: 'Vietnam',
    zipCode: '700000'
  },
  {
    addressLine1: '321 Hai Bà Trưng',
    ward: 'Phường Đa Kao',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    country: 'Vietnam',
    zipCode: '700000'
  }
];

export const seedOrders = async (regularUsers, createdProducts) => {
  console.log('📦 Creating sample orders...');
  const orders = [];
  
  // Order 1: Pending order với variants
  if (regularUsers[0] && createdProducts[0] && createdProducts[1]) {
    const product1 = createdProducts[0];
    const product2 = createdProducts[1];
    const variant1 = product1.variants && product1.variants.length > 0 ? product1.variants[0] : null;
    const variant2 = product2.variants && product2.variants.length > 0 ? product2.variants[0] : null;
    
    const item1Price = variant1 ? variant1.price : product1.price;
    const item2Price = variant2 ? variant2.price : product2.price;
    const subtotal = item1Price + (item2Price * 2);
    
    const addr = sampleAddresses[0];
    orders.push({
      orderNumber: generateOrderNumber(),
      userId: regularUsers[0]._id,
      items: [
        {
          productId: product1._id,
          variantId: variant1 ? variant1._id : null,
          productName: product1.name,
          variantName: variant1 ? variant1.name : null,
          sku: variant1 ? variant1.sku : product1.sku,
          quantity: 1,
          price: item1Price,
          subtotal: item1Price
        },
        {
          productId: product2._id,
          variantId: variant2 ? variant2._id : null,
          productName: product2.name,
          variantName: variant2 ? variant2.name : null,
          sku: variant2 ? variant2.sku : product2.sku,
          quantity: 2,
          price: item2Price,
          subtotal: item2Price * 2
        }
      ],
      subtotal: subtotal,
      discountAmount: 0,
      shippingFee: 30000,
      totalAmount: subtotal + 30000,
      shippingAddress: {
        name: regularUsers[0].name,
        phone: regularUsers[0].phone || '0901234567',
        addressLine1: addr.addressLine1,
        ward: addr.ward,
        district: addr.district,
        city: addr.city,
        country: addr.country,
        zipCode: addr.zipCode
      },
      paymentMethod: 'bank_transfer',
      paymentStatus: 'pending',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });
  }

  // Order 2: Confirmed order
  if (regularUsers[1] && createdProducts[2]) {
    const product1 = createdProducts[2];
    const product2 = createdProducts.length > 3 ? createdProducts[3] : createdProducts[0];
    const variant1 = product1.variants && product1.variants.length > 0 ? product1.variants[0] : null;
    const variant2 = product2.variants && product2.variants.length > 0 ? product2.variants[0] : null;
    
    const item1Price = variant1 ? variant1.price : product1.price;
    const item2Price = variant2 ? variant2.price : product2.price;
    const subtotal = item1Price + item2Price;
    
    const addr = sampleAddresses[1];
    orders.push({
      orderNumber: generateOrderNumber(),
      userId: regularUsers[1]._id,
      items: [
        {
          productId: product1._id,
          variantId: variant1 ? variant1._id : null,
          productName: product1.name,
          variantName: variant1 ? variant1.name : null,
          sku: variant1 ? variant1.sku : product1.sku,
          quantity: 1,
          price: item1Price,
          subtotal: item1Price
        },
        {
          productId: product2._id,
          variantId: variant2 ? variant2._id : null,
          productName: product2.name,
          variantName: variant2 ? variant2.name : null,
          sku: variant2 ? variant2.sku : product2.sku,
          quantity: 1,
          price: item2Price,
          subtotal: item2Price
        }
      ],
      subtotal: subtotal,
      discountAmount: 0,
      shippingFee: 30000,
      totalAmount: subtotal + 30000,
      shippingAddress: {
        name: regularUsers[1].name,
        phone: regularUsers[1].phone || '0912345678',
        addressLine1: addr.addressLine1,
        ward: addr.ward,
        district: addr.district,
        city: addr.city,
        country: addr.country,
        zipCode: addr.zipCode
      },
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      status: 'confirmed',
      confirmedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });
  }

  // Order 3: Shipped order
  if (regularUsers[0] && createdProducts[5]) {
    const product = createdProducts[5];
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    const itemPrice = variant ? variant.price : product.price;
    
    const addr = sampleAddresses[2];
    orders.push({
      orderNumber: generateOrderNumber(),
      userId: regularUsers[0]._id,
      items: [
        {
          productId: product._id,
          variantId: variant ? variant._id : null,
          productName: product.name,
          variantName: variant ? variant.name : null,
          sku: variant ? variant.sku : product.sku,
          quantity: 1,
          price: itemPrice,
          subtotal: itemPrice
        }
      ],
      subtotal: itemPrice,
      discountAmount: 0,
      shippingFee: 30000,
      totalAmount: itemPrice + 30000,
      shippingAddress: {
        name: regularUsers[0].name,
        phone: regularUsers[0].phone || '0901234567',
        addressLine1: addr.addressLine1,
        ward: addr.ward,
        district: addr.district,
        city: addr.city,
        country: addr.country,
        zipCode: addr.zipCode
      },
      paymentMethod: 'momo',
      paymentStatus: 'paid',
      status: 'shipped',
      trackingNumber: 'VN123456789',
      shippingCompany: 'Vietnam Post',
      paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      confirmedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    });
  }

  // Order 4: Delivered order
  if (regularUsers[1] && createdProducts[8]) {
    const product1 = createdProducts[8];
    const product2 = createdProducts.length > 9 ? createdProducts[9] : createdProducts[0];
    const variant1 = product1.variants && product1.variants.length > 0 ? product1.variants[0] : null;
    const variant2 = product2.variants && product2.variants.length > 0 ? product2.variants[0] : null;
    
    const item1Price = variant1 ? variant1.price : product1.price;
    const item2Price = variant2 ? variant2.price : product2.price;
    const subtotal = item1Price + item2Price;
    
    const addr = sampleAddresses[3];
    orders.push({
      orderNumber: generateOrderNumber(),
      userId: regularUsers[1]._id,
      items: [
        {
          productId: product1._id,
          variantId: variant1 ? variant1._id : null,
          productName: product1.name,
          variantName: variant1 ? variant1.name : null,
          sku: variant1 ? variant1.sku : product1.sku,
          quantity: 1,
          price: item1Price,
          subtotal: item1Price
        },
        {
          productId: product2._id,
          variantId: variant2 ? variant2._id : null,
          productName: product2.name,
          variantName: variant2 ? variant2.name : null,
          sku: variant2 ? variant2.sku : product2.sku,
          quantity: 1,
          price: item2Price,
          subtotal: item2Price
        }
      ],
      subtotal: subtotal,
      discountAmount: 0,
      shippingFee: 30000,
      totalAmount: subtotal + 30000,
      shippingAddress: {
        name: regularUsers[1].name,
        phone: regularUsers[1].phone || '0912345678',
        addressLine1: addr.addressLine1,
        ward: addr.ward,
        district: addr.district,
        city: addr.city,
        country: addr.country,
        zipCode: addr.zipCode
      },
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      status: 'delivered',
      trackingNumber: 'VN987654321',
      shippingCompany: 'Vietnam Post',
      paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      confirmedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      shippedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
    });
  }

  // Order 5: Another pending order - only create if we have enough products
  if (regularUsers[0] && createdProducts[10]) {
    const product = createdProducts[10];
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    const itemPrice = variant ? variant.price : product.price;
    
    const addr = sampleAddresses[0];
    orders.push({
      orderNumber: generateOrderNumber(),
      userId: regularUsers[0]._id,
      items: [
        {
          productId: product._id,
          variantId: variant ? variant._id : null,
          productName: product.name,
          variantName: variant ? variant.name : null,
          sku: variant ? variant.sku : product.sku,
          quantity: 1,
          price: itemPrice,
          subtotal: itemPrice
        }
      ],
      subtotal: itemPrice,
      discountAmount: 0,
      shippingFee: 30000,
      totalAmount: itemPrice + 30000,
      shippingAddress: {
        name: regularUsers[0].name,
        phone: regularUsers[0].phone || '0901234567',
        addressLine1: addr.addressLine1,
        ward: addr.ward,
        district: addr.district,
        city: addr.city,
        country: addr.country,
        zipCode: addr.zipCode
      },
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });
  }

  let createdOrders = [];
  if (orders.length > 0) {
    createdOrders = await Order.insertMany(orders);
    console.log(`✅ Created ${createdOrders.length} sample orders\n`);
  } else {
    console.log('⚠️  No orders created (insufficient users or products)\n');
  }

  return createdOrders;
};

