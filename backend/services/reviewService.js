/**
 * Review Service
 * Logic nghiệp vụ cho reviews: CRUD, moderation, verified buyer
 */

import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

/**
 * Lấy danh sách reviews của sản phẩm
 */
export const getProductReviews = async (productId, options = {}) => {
  const { page = 1, limit = 10, sort = 'newest', status = 'approved' } = options;

  const query = { productId };
  
  // Chỉ lấy approved reviews cho public, admin có thể xem tất cả
  if (status === 'approved') {
    query.status = 'approved';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  let sortOptions = {};
  if (sort === 'newest') {
    sortOptions.createdAt = -1;
  } else if (sort === 'oldest') {
    sortOptions.createdAt = 1;
  } else if (sort === 'highest') {
    sortOptions.rating = -1;
  } else if (sort === 'lowest') {
    sortOptions.rating = 1;
  } else if (sort === 'helpful') {
    sortOptions.helpfulCount = -1;
  }

  const reviews = await Review.find(query)
    .populate('userId', 'name email avatar')
    .populate('variantId')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Review.countDocuments(query);

  // Tính toán thống kê
  const stats = await Review.aggregate([
    { $match: { productId: productId, status: 'approved' } },
    {
      $group: {
        _id: null,
        average: { $avg: '$rating' },
        total: { $sum: 1 },
        distribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  let reviewStats = {
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };

  if (stats.length > 0) {
    const stat = stats[0];
    reviewStats.average = Math.round(stat.average * 10) / 10;
    reviewStats.total = stat.total;
    stat.distribution.forEach(rating => {
      reviewStats.distribution[rating] = (reviewStats.distribution[rating] || 0) + 1;
    });
  }

  return {
    reviews,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    },
    stats: reviewStats
  };
};

/**
 * Tạo review mới
 */
export const createReview = async (userId, productId, reviewData) => {
  const { rating, title, comment, variantId, images, orderId } = reviewData;

  // Validation
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Đánh giá phải từ 1 đến 5 sao');
  }

  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Validate variant nếu có
  if (variantId) {
    const variant = product.variants.id(variantId);
    if (!variant) {
      throw new Error('Không tìm thấy biến thể sản phẩm');
    }
  }

  // Kiểm tra xem user đã review chưa
  const existingReview = await Review.findOne({ userId, productId, variantId });
  if (existingReview) {
    throw new Error('Bạn đã đánh giá sản phẩm này rồi. Bạn có thể cập nhật đánh giá hiện tại.');
  }

  // Check verified buyer nếu có orderId
  let isVerifiedBuyer = false;
  if (orderId) {
    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
      status: { $in: ['delivered', 'completed'] }
    });
    
    if (order) {
      // Kiểm tra xem order có chứa product này không
      const hasProduct = order.items.some(item => {
        if (variantId) {
          return item.productId.toString() === productId.toString() && 
                 item.variantId && 
                 item.variantId.toString() === variantId.toString();
        }
        return item.productId.toString() === productId.toString();
      });
      
      if (hasProduct) {
        isVerifiedBuyer = true;
      }
    }
  }

  // Tạo review
  const review = new Review({
    productId,
    variantId: variantId || null,
    userId,
    orderId: orderId || null,
    rating: parseInt(rating),
    title: title?.trim() || '',
    comment: comment?.trim() || '',
    images: images || [],
    status: 'pending', // Cần admin approve
    isVerifiedBuyer
  });

  await review.save();

  // Update product rating (sẽ tính lại khi có review approved)
  await updateProductRating(productId);

  return await review.populate('userId', 'name email avatar');
};

/**
 * Cập nhật review
 */
export const updateReview = async (reviewId, userId, updateData) => {
  const review = await Review.findById(reviewId);
  
  if (!review) {
    throw new Error('Không tìm thấy đánh giá');
  }

  // Chỉ user tạo review mới được update
  if (review.userId.toString() !== userId.toString()) {
    throw new Error('Bạn không có quyền cập nhật đánh giá này');
  }

  // Chỉ cho phép update nếu status là pending hoặc approved
  if (review.status === 'rejected') {
    throw new Error('Không thể cập nhật đánh giá đã bị từ chối');
  }

  // Update fields
  if (updateData.rating !== undefined) {
    if (updateData.rating < 1 || updateData.rating > 5) {
      throw new Error('Đánh giá phải từ 1 đến 5 sao');
    }
    review.rating = parseInt(updateData.rating);
  }
  if (updateData.title !== undefined) review.title = updateData.title.trim();
  if (updateData.comment !== undefined) review.comment = updateData.comment.trim();
  if (updateData.images !== undefined) review.images = updateData.images;

  // Reset status về pending nếu đã approve (cần review lại)
  if (review.status === 'approved') {
    review.status = 'pending';
  }

  await review.save();

  // Update product rating
  await updateProductRating(review.productId);

  return await review.populate('userId', 'name email avatar');
};

/**
 * Xóa review
 */
export const deleteReview = async (reviewId, userId, isAdmin = false) => {
  const review = await Review.findById(reviewId);
  
  if (!review) {
    throw new Error('Không tìm thấy đánh giá');
  }

  // Chỉ user tạo review hoặc admin mới được xóa
  if (!isAdmin && review.userId.toString() !== userId.toString()) {
    throw new Error('Bạn không có quyền xóa đánh giá này');
  }

  const productId = review.productId;
  await Review.findByIdAndDelete(reviewId);

  // Update product rating
  await updateProductRating(productId);

  return { message: 'Đã xóa đánh giá' };
};

/**
 * Admin: Approve/Reject review
 */
export const moderateReview = async (reviewId, adminId, action, reason = '') => {
  const review = await Review.findById(reviewId);
  
  if (!review) {
    throw new Error('Không tìm thấy đánh giá');
  }

  if (action === 'approve') {
    review.status = 'approved';
    review.rejectionReason = null;
  } else if (action === 'reject') {
    review.status = 'rejected';
    review.rejectionReason = reason || 'Không phù hợp với tiêu chuẩn';
  } else {
    throw new Error('Action không hợp lệ. Chỉ có thể approve hoặc reject');
  }

  review.moderatedBy = adminId;
  review.moderatedAt = new Date();
  await review.save();

  // Update product rating
  await updateProductRating(review.productId);

  return await review.populate('userId', 'name email avatar');
};

/**
 * Mark review as helpful
 */
export const markHelpful = async (reviewId, userId) => {
  const review = await Review.findById(reviewId);
  
  if (!review) {
    throw new Error('Không tìm thấy đánh giá');
  }

  // Kiểm tra xem user đã vote chưa
  const hasVoted = review.helpfulUsers.some(
    id => id.toString() === userId.toString()
  );

  if (hasVoted) {
    // Unvote
    review.helpfulUsers = review.helpfulUsers.filter(
      id => id.toString() !== userId.toString()
    );
    review.helpfulCount = Math.max(0, review.helpfulCount - 1);
  } else {
    // Vote
    review.helpfulUsers.push(userId);
    review.helpfulCount += 1;
  }

  await review.save();
  return { helpfulCount: review.helpfulCount, hasVoted: !hasVoted };
};

/**
 * Tính lại rating của product từ các reviews đã approved
 */
const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { 
      $match: { 
        productId: productId, 
        status: 'approved' 
      } 
    },
    {
      $group: {
        _id: null,
        average: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    const stat = stats[0];
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stat.average * 10) / 10,
      reviewCount: stat.count
    });
  } else {
    // Không có review nào, reset về 0
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviewCount: 0
    });
  }
};

