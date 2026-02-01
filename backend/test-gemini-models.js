import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const listModels = async () => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is missing');
            return;
        }

        console.log('Fetching available models from REST API using built-in fetch...');
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach(m => {
                const nameOnly = m.name.split('/').pop();
                const supportsGenerate = m.supportedGenerationMethods?.includes('generateContent');
                console.log(`- ${nameOnly} (Full: ${m.name}) ${supportsGenerate ? '[Supports Generate]' : ''}`);
            });
        } else {
            console.log('No models found or error response:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
};

listModels();
