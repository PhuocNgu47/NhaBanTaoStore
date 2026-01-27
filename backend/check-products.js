import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find().sort({ createdAt: -1 }).limit(3);
        console.log('Latest 3 products:');
        products.forEach(p => {
            console.log({
                _id: p._id,
                name: p.name,
                slug: p.slug,
                createdAt: p.createdAt
            });
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkProducts();
