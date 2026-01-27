import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Banner from './models/Banner.js';

dotenv.config();

const checkBanners = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        console.log('Current Server Time (UTC):', new Date().toISOString());

        const banners = await Banner.find({});
        console.log(`Total Banners: ${banners.length}`);

        banners.forEach(b => {
            console.log('---');
            console.log(`Title: ${b.title}`);
            console.log(`Active: ${b.isActive}`);
            console.log(`Start Date: ${b.startDate ? b.startDate.toISOString() : 'None'}`);
            console.log(`End Date: ${b.endDate ? b.endDate.toISOString() : 'None'}`);
            console.log(`Display Order: ${b.displayOrder}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkBanners();
