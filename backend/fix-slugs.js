import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

function slugify(text) {
    return text.toString().toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const fixSlugs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({
            $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }]
        });

        console.log(`Found ${products.length} products without slug.`);

        for (const p of products) {
            let baseSlug = slugify(p.name);
            let slug = baseSlug;
            let counter = 1;

            // Check for duplicate
            while (await Product.findOne({ slug, _id: { $ne: p._id } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            p.slug = slug;
            await p.save(); // This will also trigger our new pre-save hook, but we set it manually here to be sure
            console.log(`Updated product "${p.name}" with slug: ${slug}`);
        }

        console.log('All products updated.');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

fixSlugs();
