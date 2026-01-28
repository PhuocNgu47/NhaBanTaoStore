import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const setupTestAccounts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const testAccounts = [
            {
                name: 'Admin System',
                email: 'admin@nhabantao.com',
                password: 'password123',
                role: 'admin'
            },
            {
                name: 'Shop Owner',
                email: 'owner@nhabantao.com',
                password: 'password123',
                role: 'owner'
            },
            {
                name: 'Staff Member',
                email: 'staff@nhabantao.com',
                password: 'password123',
                role: 'staff'
            }
        ];

        for (const account of testAccounts) {
            const userExists = await User.findOne({ email: account.email });
            if (userExists) {
                userExists.role = account.role;
                await userExists.save();
                console.log(`Updated existing user: ${account.email} to role: ${account.role}`);
            } else {
                await User.create(account);
                console.log(`Created new test user: ${account.email} with role: ${account.role}`);
            }
        }

        console.log('\n--- ACCOUNT LIST ---');
        console.log('1. Admin: admin@nhabantao.com / password123');
        console.log('2. Owner: owner@nhabantao.com / password123');
        console.log('3. Staff: staff@nhabantao.com / password123');
        console.log('--- PIN BẢO MẬT: 123456 ---\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

setupTestAccounts();
