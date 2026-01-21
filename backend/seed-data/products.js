/**
 * Seed Data - Products
 * 
 * Dữ liệu sản phẩm Apple cho e-commerce
 * Categories: ipad, macbook, am-thanh, phu-kien-apple, phu-kien-ipad
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load products từ JSON file
const productsJsonPath = path.join(__dirname, 'products.json');
let PRODUCTS = [];

try {
  const productsJson = fs.readFileSync(productsJsonPath, 'utf-8');
  PRODUCTS = JSON.parse(productsJson);
} catch (error) {
  console.error('Error loading products.json:', error.message);
}

// Helper functions
export const convertPriceToVND = (priceUSD) => {
  const exchangeRate = 25000; // 1 USD = 25,000 VND
  return Math.round(priceUSD * exchangeRate);
};

export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const generateSKU = (name, index) => {
  const prefix = name
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  return `${prefix}-${String(index + 1).padStart(4, '0')}`;
};

export { PRODUCTS };
