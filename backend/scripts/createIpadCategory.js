import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const IPAD_CATEGORY = {
    name: "iPad",
    slug: "ipad",
    description: "Máy tính bảng Apple iPad",
    icon: "FiTablet",
    image: "/categories/ipad.jpg",
    order: 2,
    isActive: true,
    isFeatured: true,
    showInMenu: true,
    children: [] // Simplified for now, can add subcategories if needed
};

async function createCategory() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const existing = await Category.findOne({ slug: 'ipad' });
        if (existing) {
            console.log('iPad category already exists.');
            if (!existing.isActive || !existing.showInMenu) {
                console.log('Updating iPad category to be active and visible...');
                existing.isActive = true;
                existing.showInMenu = true;
                await existing.save();
                console.log('Updated.');
            }
        } else {
            console.log('iPad category missing. Creating...');
            await Category.create(IPAD_CATEGORY);
            console.log('Created iPad category.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createCategory();
