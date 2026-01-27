import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ActivityLog from './models/ActivityLog.js';

dotenv.config();

const checkLogs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const count = await ActivityLog.countDocuments();
        console.log(`Total Activity Logs: ${count}`);

        if (count > 0) {
            const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(3);
            console.log('Latest 3 logs:', JSON.stringify(logs, null, 2));
        } else {
            console.log('No logs found. Perform some admin actions to generate logs.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkLogs();
