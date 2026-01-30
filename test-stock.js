import mongoose from 'mongoose';
import Product from './backend/models/Product.js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nhabantaostore';

async function testStock() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const product = await Product.findOne({ variants: { $exists: true, $not: { $size: 0 } } });
    if (!product) {
        console.log('No products with variants found');
        process.exit(1);
    }

    const variant = product.variants[0];
    const oldStock = variant.stock;
    const oldProductStock = product.stock;

    console.log(`Original: Product Stock=${oldProductStock}, Variant[0] Stock=${oldStock}`);

    // Simulate deduction
    variant.stock = Math.max(0, variant.stock - 1);

    // Try to save and see if it works
    await product.save();

    const updatedProduct = await Product.findById(product._id);
    console.log(`After Save: Product Stock=${updatedProduct.stock}, Variant[0] Stock=${updatedProduct.variants[0].stock}`);

    if (updatedProduct.variants[0].stock === oldStock - 1) {
        console.log('✅ Stock persisted successfully!');
    } else {
        console.log('❌ Stock NOT persisted!');
    }

    // Restore for safety
    updatedProduct.variants[0].stock = oldStock;
    await updatedProduct.save();

    await mongoose.disconnect();
}

testStock().catch(err => {
    console.error(err);
    process.exit(1);
});
