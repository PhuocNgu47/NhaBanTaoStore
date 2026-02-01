import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const testFinal = async () => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        console.log('Testing gemini-flash-latest...');
        const result = await model.generateContent('Say "Hello from Nhà Bán Táo AI"');
        const response = await result.response;
        console.log('✅ Response:', response.text());
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

testFinal();
