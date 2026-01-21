/**
 * Seed Carts
 * Tạo carts mẫu cho users
 */

import Cart from '../models/Cart.js';

export const seedCarts = async (regularUsers, createdProducts) => {
  console.log('🛒 Creating sample carts...');
  const carts = [];
  
  for (let i = 0; i < Math.min(regularUsers.length, 3); i++) {
    const user = regularUsers[i];
    const product = createdProducts[i % createdProducts.length];
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    
    carts.push({
      userId: user._id,
      items: [
        {
          productId: product._id,
          variantId: variant ? variant._id : null,
          quantity: Math.floor(Math.random() * 3) + 1
        }
      ],
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
  }
  
  let createdCarts = [];
  if (carts.length > 0) {
    createdCarts = await Cart.insertMany(carts);
    console.log(`✅ Created ${createdCarts.length} carts\n`);
  } else {
    console.log('⚠️  No carts created\n');
  }
  
  return createdCarts;
};

