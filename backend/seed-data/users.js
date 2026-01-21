/**
 * Seed Data - Users
 * 
 * Dữ liệu người dùng mẫu
 * Lưu ý: Password sẽ được hash tự động bởi User model
 */

export const USERS = [
  {
    name: 'Admin Apple Store',
    email: 'admin@applestore.vn',
    password: 'Admin@123', // Sẽ được hash tự động
    role: 'admin',
    phone: '0909123456',
    isEmailVerified: true,
    isActive: true,
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  },
  {
    name: 'Nguyễn Văn Tester',
    email: 'user@applestore.vn',
    password: 'User@123', // Sẽ được hash tự động
    role: 'user',
    phone: '0901234567',
    isEmailVerified: true,
    isActive: true,
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  },
  {
    name: 'Trần Thị Minh',
    email: 'minh.tran@gmail.com',
    password: 'User@123',
    role: 'user',
    phone: '0912345678',
    isEmailVerified: true,
    isActive: true,
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: false,
        sms: false,
        push: true
      }
    }
  },
  {
    name: 'Lê Hoàng Nam',
    email: 'nam.le@gmail.com',
    password: 'User@123',
    role: 'user',
    phone: '0923456789',
    isEmailVerified: false,
    isActive: true,
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: true,
        sms: false,
        push: false
      }
    }
  }
];
