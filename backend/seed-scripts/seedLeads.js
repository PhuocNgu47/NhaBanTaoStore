/**
 * Seed Leads
 * Tạo leads với dữ liệu mẫu để test admin dashboard
 */

import Lead from '../models/Lead.js';
import Product from '../models/Product.js';

// Generate UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Vietnamese phone numbers
const generatePhone = () => {
  const prefixes = ['090', '091', '092', '093', '094', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}${suffix}`;
};

// Vietnamese names
const names = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Văn Em',
  'Vũ Thị Phương', 'Đặng Văn Hùng', 'Bùi Thị Lan', 'Đỗ Văn Minh', 'Ngô Thị Nga',
  'Phan Văn Oanh', 'Võ Thị Phượng', 'Lý Văn Quang', 'Đinh Thị Quỳnh', 'Tôn Văn Sơn',
  'Lương Thị Tâm', 'Chu Văn Uyên', 'Dương Thị Vân', 'Hồ Văn Xuân', 'Mai Thị Yến',
  'Lâm Văn Bảo', 'Nguyễn Thị Chi', 'Trần Văn Đức', 'Lê Thị Hoa', 'Phạm Văn Khoa'
];

// Categories
const categories = ['iPad', 'iPhone', 'MacBook', 'Apple Watch', 'AirPods', 'Accessories'];

export const seedLeads = async () => {
  console.log('📊 Creating leads...');
  
  // Get some products to reference
  const products = await Product.find().limit(50);
  
  if (products.length === 0) {
    console.log('⚠️  No products found. Please seed products first.');
    return [];
  }

  const leads = [];
  const now = new Date();

  // Lead 1: High Spender with phone and email (Actionable)
  const lead1 = new Lead({
    guestId: generateUUID(),
    info: {
      name: names[0],
      phone: generatePhone(),
      email: `lead1.${Math.random().toString(36).substring(7)}@example.com`
    },
    viewedProducts: products.slice(0, 8).map((p, idx) => ({
      productId: p._id,
      productName: p.name,
      category: p.category || categories[Math.floor(Math.random() * categories.length)],
      price: p.price || (15000000 + Math.random() * 10000000), // High value products
      timestamp: new Date(now - (idx * 3600000)) // Last 8 hours
    })),
    interestScore: new Map([
      ['MacBook', 5],
      ['iPad', 3]
    ]),
    topInterest: 'MacBook',
    tags: ['High Spender'],
    lastActive: new Date(now - 5 * 60000), // 5 minutes ago
    createdAt: new Date(now - 2 * 24 * 3600000) // 2 days ago
  });
  leads.push(lead1);

  // Lead 2: Recent lead with phone only (Actionable)
  const lead2 = new Lead({
    guestId: generateUUID(),
    info: {
      name: names[1],
      phone: generatePhone(),
      email: null
    },
    viewedProducts: products.slice(2, 6).map((p, idx) => ({
      productId: p._id,
      productName: p.name,
      category: p.category || categories[Math.floor(Math.random() * categories.length)],
      price: p.price || (5000000 + Math.random() * 5000000),
      timestamp: new Date(now - (idx * 1800000)) // Last 1.5 hours
    })),
    interestScore: new Map([
      ['iPhone', 4]
    ]),
    topInterest: 'iPhone',
    tags: [],
    lastActive: new Date(now - 2 * 60000), // 2 minutes ago
    createdAt: new Date(now - 1 * 3600000) // 1 hour ago
  });
  leads.push(lead2);

  // Lead 3: Lead with email only
  const lead3 = new Lead({
    guestId: generateUUID(),
    info: {
      name: names[2],
      phone: null,
      email: `lead3.${Math.random().toString(36).substring(7)}@example.com`
    },
    viewedProducts: products.slice(4, 10).map((p, idx) => ({
      productId: p._id,
      productName: p.name,
      category: p.category || categories[Math.floor(Math.random() * categories.length)],
      price: p.price || (3000000 + Math.random() * 4000000),
      timestamp: new Date(now - (idx * 7200000)) // Last 12 hours
    })),
    interestScore: new Map([
      ['iPad', 6]
    ]),
    topInterest: 'iPad',
    tags: [],
    lastActive: new Date(now - 30 * 60000), // 30 minutes ago
    createdAt: new Date(now - 3 * 24 * 3600000) // 3 days ago
  });
  leads.push(lead3);

  // Lead 4: High Spender with phone (Actionable)
  const lead4 = new Lead({
    guestId: generateUUID(),
    info: {
      name: names[3],
      phone: generatePhone(),
      email: `lead4.${Math.random().toString(36).substring(7)}@example.com`
    },
    viewedProducts: products.slice(0, 12).map((p, idx) => ({
      productId: p._id,
      productName: p.name,
      category: p.category || categories[Math.floor(Math.random() * categories.length)],
      price: p.price || (12000000 + Math.random() * 8000000), // High value
      timestamp: new Date(now - (idx * 2400000)) // Last 8 hours
    })),
    interestScore: new Map([
      ['MacBook', 7],
      ['iPad', 5]
    ]),
    topInterest: 'MacBook',
    tags: ['High Spender'],
    lastActive: new Date(now - 15 * 60000), // 15 minutes ago
    createdAt: new Date(now - 1 * 24 * 3600000) // 1 day ago
  });
  leads.push(lead4);

  // Lead 5: Anonymous lead (no contact info)
  const lead5 = new Lead({
    guestId: generateUUID(),
    info: {
      name: null,
      phone: null,
      email: null
    },
    viewedProducts: products.slice(6, 9).map((p, idx) => ({
      productId: p._id,
      productName: p.name,
      category: p.category || categories[Math.floor(Math.random() * categories.length)],
      price: p.price || (2000000 + Math.random() * 3000000),
      timestamp: new Date(now - (idx * 3600000))
    })),
    interestScore: new Map([
      ['Apple Watch', 3]
    ]),
    topInterest: 'Apple Watch',
    tags: [],
    lastActive: new Date(now - 1 * 3600000), // 1 hour ago
    createdAt: new Date(now - 5 * 24 * 3600000) // 5 days ago
  });
  leads.push(lead5);

  // Lead 6: Recent lead with phone (Actionable)
  const lead6 = new Lead({
    guestId: generateUUID(),
    info: {
      name: names[5],
      phone: generatePhone(),
      email: null
    },
    viewedProducts: products.slice(8, 11).map((p, idx) => ({
      productId: p._id,
      productName: p.name,
      category: p.category || categories[Math.floor(Math.random() * categories.length)],
      price: p.price || (4000000 + Math.random() * 3000000),
      timestamp: new Date(now - (idx * 900000)) // Last 15 minutes
    })),
    interestScore: new Map([
      ['AirPods', 3]
    ]),
    topInterest: 'AirPods',
    tags: [],
    lastActive: new Date(now - 1 * 60000), // 1 minute ago
    createdAt: new Date(now - 30 * 60000) // 30 minutes ago
  });
  leads.push(lead6);

  // Lead 7: Lead with both phone and email (Actionable)
  const lead7 = new Lead({
    guestId: generateUUID(),
    info: {
      name: names[6],
      phone: generatePhone(),
      email: `lead7.${Math.random().toString(36).substring(7)}@example.com`
    },
    viewedProducts: products.slice(10, 15).map((p, idx) => ({
      productId: p._id,
      productName: p.name,
      category: p.category || categories[Math.floor(Math.random() * categories.length)],
      price: p.price || (6000000 + Math.random() * 4000000),
      timestamp: new Date(now - (idx * 5400000)) // Last 6.75 hours
    })),
    interestScore: new Map([
      ['iPhone', 5]
    ]),
    topInterest: 'iPhone',
    tags: [],
    lastActive: new Date(now - 10 * 60000), // 10 minutes ago
    createdAt: new Date(now - 4 * 24 * 3600000) // 4 days ago
  });
  leads.push(lead7);

  // Lead 8: Old lead with phone (Actionable but older)
  const lead8 = new Lead({
    guestId: generateUUID(),
    info: {
      name: names[7],
      phone: generatePhone(),
      email: `lead8.${Math.random().toString(36).substring(7)}@example.com`
    },
    viewedProducts: products.slice(12, 16).map((p, idx) => ({
      productId: p._id,
      productName: p.name,
      category: p.category || categories[Math.floor(Math.random() * categories.length)],
      price: p.price || (8000000 + Math.random() * 5000000),
      timestamp: new Date(now - (7 + idx) * 24 * 3600000) // 7-10 days ago
    })),
    interestScore: new Map([
      ['iPad', 4]
    ]),
    topInterest: 'iPad',
    tags: [],
    lastActive: new Date(now - 7 * 24 * 3600000), // 7 days ago
    createdAt: new Date(now - 10 * 24 * 3600000) // 10 days ago
  });
  leads.push(lead8);

  // Lead 9: High Spender with phone (Actionable)
  const lead9 = new Lead({
    guestId: generateUUID(),
    info: {
      name: names[8],
      phone: generatePhone(),
      email: `lead9.${Math.random().toString(36).substring(7)}@example.com`
    },
    viewedProducts: products.slice(0, 15).map((p, idx) => ({
      productId: p._id,
      productName: p.name,
      category: p.category || categories[Math.floor(Math.random() * categories.length)],
      price: p.price || (13000000 + Math.random() * 7000000), // High value
      timestamp: new Date(now - (idx * 1800000)) // Last 7.5 hours
    })),
    interestScore: new Map([
      ['MacBook', 10],
      ['iPad', 5]
    ]),
    topInterest: 'MacBook',
    tags: ['High Spender'],
    lastActive: new Date(now - 8 * 60000), // 8 minutes ago
    createdAt: new Date(now - 6 * 3600000) // 6 hours ago
  });
  leads.push(lead9);

  // Lead 10: Recent anonymous lead
  const lead10 = new Lead({
    guestId: generateUUID(),
    info: {
      name: null,
      phone: null,
      email: null
    },
    viewedProducts: products.slice(15, 18).map((p, idx) => ({
      productId: p._id,
      productName: p.name,
      category: p.category || categories[Math.floor(Math.random() * categories.length)],
      price: p.price || (1000000 + Math.random() * 2000000),
      timestamp: new Date(now - (idx * 300000)) // Last 5 minutes
    })),
    interestScore: new Map([
      ['Accessories', 3]
    ]),
    topInterest: 'Accessories',
    tags: [],
    lastActive: new Date(now - 3 * 60000), // 3 minutes ago
    createdAt: new Date(now - 10 * 60000) // 10 minutes ago
  });
  leads.push(lead10);

  // Generate additional random leads
  for (let i = 0; i < 15; i++) {
    const hasPhone = Math.random() > 0.3; // 70% have phone
    const hasEmail = Math.random() > 0.4; // 60% have email
    const hasName = Math.random() > 0.2; // 80% have name
    
    const viewCount = Math.floor(Math.random() * 10) + 3; // 3-12 views
    const startIdx = Math.floor(Math.random() * (products.length - viewCount));
    const selectedProducts = products.slice(startIdx, startIdx + viewCount);
    
    // Random category distribution
    const categoryCounts = {};
    selectedProducts.forEach(p => {
      const cat = p.category || categories[Math.floor(Math.random() * categories.length)];
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    const topCategory = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || categories[0];
    
    // Determine if high spender (60% of products > 10M)
    const highValueCount = selectedProducts.filter(p => (p.price || 0) > 10000000).length;
    const isHighSpender = highValueCount / selectedProducts.length > 0.6;
    
    // Random lastActive (from 1 minute to 7 days ago)
    const daysAgo = Math.random() * 7;
    const lastActive = new Date(now - daysAgo * 24 * 3600000);
    
    const lead = new Lead({
      guestId: generateUUID(),
      info: {
        name: hasName ? names[Math.floor(Math.random() * names.length)] : null,
        phone: hasPhone ? generatePhone() : null,
        email: hasEmail ? `lead${i + 11}.${Math.random().toString(36).substring(7)}@example.com` : null
      },
      viewedProducts: selectedProducts.map((p, idx) => ({
        productId: p._id,
        productName: p.name,
        category: p.category || categories[Math.floor(Math.random() * categories.length)],
        price: p.price || (3000000 + Math.random() * 7000000),
        timestamp: new Date(lastActive - (viewCount - idx) * 3600000) // Spread over hours
      })),
      interestScore: new Map(Object.entries(categoryCounts)),
      topInterest: topCategory,
      tags: isHighSpender ? ['High Spender'] : [],
      lastActive: lastActive,
      createdAt: new Date(lastActive - Math.random() * 3 * 24 * 3600000) // Created 0-3 days before lastActive
    });
    
    leads.push(lead);
  }

  // Save all leads
  const savedLeads = await Lead.insertMany(leads);
  
  console.log(`✅ Created ${savedLeads.length} leads`);
  console.log(`   • With phone: ${savedLeads.filter(l => l.info?.phone).length}`);
  console.log(`   • With email: ${savedLeads.filter(l => l.info?.email).length}`);
  console.log(`   • High Spenders: ${savedLeads.filter(l => l.tags?.includes('High Spender')).length}`);
  console.log(`   • Anonymous: ${savedLeads.filter(l => !l.info?.phone && !l.info?.email).length}\n`);
  
  return savedLeads;
};
