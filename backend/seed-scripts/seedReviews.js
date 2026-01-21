/**
 * Seed Reviews
 * Tạo reviews mẫu từ orders đã delivered
 */

import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const seedReviews = async (deliveredOrders) => {
  console.log('💬 Creating sample reviews...');
  const reviews = [];
  
  // Tạo reviews cho một số sản phẩm đã delivered
  for (const order of deliveredOrders.slice(0, 3)) {
    if (order.userId && order.items.length > 0) {
      const item = order.items[0];
      const product = await Product.findById(item.productId);
      if (product) {
        reviews.push({
          productId: product._id,
          variantId: item.variantId || null,
          userId: order.userId,
          orderId: order._id,
          rating: Math.floor(Math.random() * 2) + 4, // 4 hoặc 5
          title: 'Sản phẩm tuyệt vời!',
          comment: 'Rất hài lòng với sản phẩm này. Chất lượng tốt, giao hàng nhanh.',
          images: [],
          status: 'approved', // Auto approve cho seed data
          isVerifiedBuyer: true,
          helpfulCount: Math.floor(Math.random() * 10),
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        });
      }
    }
  }
  
  let createdReviews = [];
  if (reviews.length > 0) {
    createdReviews = await Review.insertMany(reviews);
    console.log(`✅ Created ${createdReviews.length} reviews\n`);
    
    // Update product rating và reviewCount
    for (const review of createdReviews) {
      const product = await Product.findById(review.productId);
      if (product) {
        const allReviews = await Review.find({ 
          productId: product._id, 
          status: 'approved' 
        });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        product.rating = Math.round(avgRating * 10) / 10;
        product.reviewCount = allReviews.length;
        await product.save();
      }
    }
  } else {
    console.log('⚠️  No reviews created\n');
  }
  
  return createdReviews;
};

