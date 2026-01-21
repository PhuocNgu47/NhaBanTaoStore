/**
 * Seed Users
 * Tạo users từ seed data
 */

import User from '../models/User.js';
import { USERS } from '../seed-data/users.js';

export const seedUsers = async () => {
  console.log('👤 Creating users...');
  const createdUsers = [];
  
  for (const userData of USERS) {
    const user = new User(userData);
    await user.save();
    createdUsers.push(user);
  }
  
  console.log(`✅ Created ${createdUsers.length} users\n`);
  return createdUsers;
};

