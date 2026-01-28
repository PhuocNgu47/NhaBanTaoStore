import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();

// Helper to check if image is accessible
async function checkImageAccess(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INPUT_FILE = path.join(__dirname, '../product-data-input.md');

// Helper to clean price string: "4.480.000 VND" -> 4480000
function parsePrice(str) {
    if (!str) return 0;
    return parseInt(str.replace(/\./g, '').replace(/,/g, '').replace(/\D/g, ''), 10) || 0;
}

// Simple slug generator matching the model's logic roughly
function simpleSlugify(text) {
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

async function connectDB() {
    if (!process.env.MONGODB_URI) {
        console.error('Missing MONGODB_URI');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
}

async function parseFile() {
    try {
        const data = await fs.readFile(INPUT_FILE, 'utf8');
        // Split by divider '---'
        const parts = data.split('---').map(p => p.trim()).filter(p => p);

        // First part is instruction, ignore. The rest are products.
        // If user deleted instructions, we might need to be careful.
        // We assume parts[0] is header if it contains "DỮ DÁN" or similar? 
        // Let's assume ANY block that looks like product data is product data.
        // A block is product data if it has a price line?

        const productBlocks = [];

        for (const part of parts) {
            if (part.includes('DỮ LIỆU SẢN PHẨM')) continue; // Skip header block
            if (part.length < 10) continue; // Skip empty/noise
            productBlocks.push(part);
        }

        return productBlocks;
    } catch (error) {
        console.error('Error reading input file:', error);
        return [];
    }
}

async function processBlock(block) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return null;

    const productData = {
        name: '',
        price: 0,
        originalPrice: 0,
        images: [],
        description: '',
        category: 'other',
        variants: [],
        attributes: {
            colors: [],
            storage: '',
            status: 'nguyen-seal'
        }
    };

    // 1. Name: Assume first line
    productData.name = lines[0];

    // 2. Scan lines
    let descriptionLines = [];
    let foundPrice = false;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        // Price
        if (!foundPrice && /\d{1,3}(\.\d{3})+/.test(line)) {
            const prices = line.match(/\d{1,3}(\.\d{3})+/g);
            if (prices && prices.length > 0) {
                productData.price = parsePrice(prices[0]);
                if (prices.length > 1) {
                    productData.originalPrice = parsePrice(prices[1]);
                }
                foundPrice = true;
                continue;
            }
        }

        // Metadata parsing
        if (line.toLowerCase().startsWith('status:')) {
            const status = line.split(':')[1].trim().toLowerCase();
            if (status.includes('cpo')) productData.attributes.status = 'cpo';
            else if (status.includes('openbox') || status.includes('99%') || status.includes('old')) productData.attributes.status = 'openbox';
            else productData.attributes.status = 'nguyen-seal';
            continue;
        }

        if (line.toLowerCase().startsWith('storage:')) {
            productData.attributes.storage = line.split(':')[1].trim();
            continue;
        }

        if (line.toLowerCase().startsWith('colors:') || line.toLowerCase().startsWith('color:')) {
            const colorsStr = line.split(':')[1].trim();
            productData.attributes.colors = colorsStr.split(/,|;/).map(c => c.trim()).filter(c => c);
            continue;
        }

        // Image
        if (line.startsWith('http')) {
            productData.images.push(line);
            continue;
        }

        // Description
        descriptionLines.push(line);
    }

    productData.description = descriptionLines.join('\n');

    // Category Inference
    const lowerName = productData.name.toLowerCase();
    if (lowerName.includes('iphone')) productData.category = 'iphone';
    else if (lowerName.includes('ipad')) productData.category = 'ipad';
    else if (lowerName.includes('macbook')) productData.category = 'macbook';
    else if (lowerName.includes('watch')) productData.category = 'apple-watch';
    else if (lowerName.includes('airpods')) productData.category = 'airpods';
    else if (lowerName.includes('sạc') || lowerName.includes('cáp') || lowerName.includes('ốp')) productData.category = 'phu-kien';

    // Main image
    if (productData.images.length > 0) {
        productData.image = productData.images[0];
    }

    // Generate Variants
    // If colors exist, create variant for each color
    if (productData.attributes.colors.length > 0) {
        productData.variants = productData.attributes.colors.map((color, index) => ({
            sku: `VAR-${Date.now()}-${index}`,
            name: `${productData.name} - ${color}`,
            type: productData.attributes.status,
            attributes: {
                color: color,
                storage: productData.attributes.storage,
            },
            price: productData.price,
            originalPrice: productData.originalPrice || productData.price,
            stock: 10,
            image: productData.images[index] || productData.image || '', // Try to match image index to color index
            images: productData.images, // Full gallery
            isActive: true
        }));
    } else {
        // Single variant
        productData.variants = [{
            sku: `VAR-${Date.now()}`,
            name: productData.name,
            type: productData.attributes.status,
            attributes: {
                storage: productData.attributes.storage
            },
            price: productData.price,
            originalPrice: productData.originalPrice || productData.price,
            stock: 10,
            image: productData.image,
            images: productData.images,
            isActive: true
        }];
    }

    return productData;
}

async function importProducts() {
    await connectDB();

    const blocks = await parseFile();
    console.log(`Found ${blocks.length} potential product blocks.`);

    for (const block of blocks) {
        const data = await processBlock(block);
        if (!data) continue;

        console.log(`Processing: ${data.name}`);

        // Customize validation
        if (data.image) {
            const isAccessible = await checkImageAccess(data.image);
            if (!isAccessible) {
                console.warn(`[WARNING] Image might be broken for ${data.name}: ${data.image}`);
            }
        }

        // Slug generation
        const slug = simpleSlugify(data.name);

        // Upsert
        try {
            // Check if exists
            const existing = await Product.findOne({ slug });

            const productPayload = {
                ...data,
                slug,
                status: 'active',
                stock: data.variants.reduce((sum, v) => sum + v.stock, 0),
                variants: data.variants // Use generated variants
            };

            if (existing) {
                console.log(`Updating existing product: ${slug}`);
                // We might want to keep some existing fields? For now, we overwrite core data
                // But let's try to update, keeping old variants if we wanted to be safer.
                // For this simple tool, full update is expected.
                await Product.updateOne({ slug }, productPayload);
            } else {
                console.log(`Creating new product: ${slug}`);
                await Product.create(productPayload);
            }
        } catch (err) {
            console.error(`Failed to save ${data.name}:`, err.message);
        }
    }

    console.log('Import completed.');
    await mongoose.disconnect();
}

importProducts().catch(console.error);
