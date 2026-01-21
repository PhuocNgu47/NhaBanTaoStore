/**
 * Seed Products
 * Tạo products từ seed data với variants support
 */

import Product from '../models/Product.js';
import { PRODUCTS, convertPriceToVND, generateSlug, generateSKU } from '../seed-data/products.js';

export const seedProducts = async () => {
  console.log('📦 Creating products...');
  
  // Convert price và prepare products
  const productsToInsert = PRODUCTS.map((product, index) => {
    // Nếu product đã có price là VND (lớn hơn 1000), giữ nguyên
    // Nếu price nhỏ hơn 1000, coi như USD và convert sang VND (1 USD = 25000 VND)
    let priceVND = product.price || 0;
    let originalPriceVND = product.originalPrice || product.price || 0;
    
    if (priceVND < 1000) {
      priceVND = convertPriceToVND(priceVND);
      originalPriceVND = convertPriceToVND(originalPriceVND);
    }
    
    // Tạo slug từ name
    const slug = product.slug || generateSlug(product.name);
    
    // Tạo SKU từ name nếu chưa có
    const sku = product.sku || generateSKU(product.name, index);
    
    // Convert variants price nếu có
    const variants = (product.variants || []).map(variant => {
      let variantPrice = variant.price || 0;
      if (variantPrice < 1000) {
        variantPrice = convertPriceToVND(variantPrice);
      }
      return {
        ...variant,
        price: variantPrice,
        originalPrice: variant.originalPrice 
          ? (variant.originalPrice < 1000 ? convertPriceToVND(variant.originalPrice) : variant.originalPrice) 
          : variantPrice
      };
    });
    
    return {
      ...product,
      price: priceVND,
      originalPrice: originalPriceVND,
      sku: sku,
      slug: slug,
      stock: product.stock || 0,
      variants: variants,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      viewCount: product.viewCount || 0,
      status: product.status || 'active',
      featured: product.featured || false,
      currency: 'VND'
    };
  });
  
  const createdProducts = await Product.insertMany(productsToInsert);
  console.log(`✅ Created ${createdProducts.length} products\n`);
  
  return createdProducts;
};

