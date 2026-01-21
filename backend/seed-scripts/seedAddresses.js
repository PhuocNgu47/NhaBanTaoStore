/**
 * Seed Addresses
 * Tạo addresses mẫu cho users
 */

import Address from '../models/Address.js';

export const seedAddresses = async (regularUsers) => {
  console.log('📍 Creating sample addresses...');
  const addresses = [];
  
  const sampleAddresses = [
    {
      address: '123 Đường Nguyễn Huệ',
      district: 'Quận 1',
      city: 'Hồ Chí Minh',
      ward: 'Phường Bến Nghé'
    },
    {
      address: '456 Đường Lê Lợi',
      district: 'Quận 1',
      city: 'Hồ Chí Minh',
      ward: 'Phường Bến Thành'
    },
    {
      address: '789 Đường Điện Biên Phủ',
      district: 'Quận Bình Thạnh',
      city: 'Hồ Chí Minh',
      ward: 'Phường 25'
    },
    {
      address: '321 Đường Cầu Giấy',
      district: 'Quận Cầu Giấy',
      city: 'Hà Nội',
      ward: 'Phường Dịch Vọng'
    },
    {
      address: '654 Đường Trần Phú',
      district: 'Quận Hải Châu',
      city: 'Đà Nẵng',
      ward: 'Phường Thanh Bình'
    }
  ];

  for (let i = 0; i < Math.min(regularUsers.length, 5); i++) {
    const user = regularUsers[i];
    const sampleAddr = sampleAddresses[i] || sampleAddresses[0];
    
    addresses.push({
      userId: user._id,
      name: user.name || 'Nguyễn Văn A',
      phone: user.phone || '0901234567',
      address: sampleAddr.address,
      ward: sampleAddr.ward,
      district: sampleAddr.district,
      city: sampleAddr.city,
      country: 'Vietnam',
      zipCode: '700000',
      isDefault: i === 0, // User đầu tiên có địa chỉ mặc định
      label: i === 0 ? 'Nhà riêng' : (i === 1 ? 'Công ty' : 'Khác')
    });
  }
  
  let createdAddresses = [];
  if (addresses.length > 0) {
    createdAddresses = await Address.insertMany(addresses);
    console.log(`✅ Created ${createdAddresses.length} addresses\n`);
  }
  
  return createdAddresses;
};

