/**
 * Seed Wishlists
 * Tạo wishlists mẫu cho users
 */

import Wishlist from '../models/Wishlist.js';

export const seedWishlists = async (regularUsers, createdProducts) => {
  console.log('❤️  Creating sample wishlists...');
  const wishlists = [];
  
  for (let i = 0; i < Math.min(regularUsers.length, 5); i++) {
    const user = regularUsers[i];
    const product = createdProducts[i % createdProducts.length];
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    
    wishlists.push({
      userId: user._id,
      productId: product._id,
      variantId: variant ? variant._id : null,
      addedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
    });
  }
  
  let createdWishlists = [];
  if (wishlists.length > 0) {
    createdWishlists = await Wishlist.insertMany(wishlists);
    console.log(`✅ Created ${createdWishlists.length} wishlist items\n`);
  } else {
    console.log('⚠️  No wishlists created\n');
  }
  
  return createdWishlists;
};

