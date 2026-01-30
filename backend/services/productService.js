/**
 * Product Service
 * Chứa logic nghiệp vụ cho products: CRUD, filter, search, pagination, reviews
 */

import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

/**
 * Lấy danh sách products với filter, search, pagination
 */
export const getProducts = async (filters) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    inStock,
    minRating,
    sort = 'newest',
    order = 'desc',
    page = 1,
    limit = 12
  } = filters;

  // Xử lý category filter: lấy cả descendants
  let categorySlugs = null;
  if (category && category !== 'all') {
    try {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        const descendants = await Category.getDescendants(cat._id);
        categorySlugs = [cat.slug, ...descendants.map(d => d.slug)];
      } else {
        // Nếu không tìm thấy category trong DB, vẫn giữ nguyên slug để tìm chính xác
        // (đề phòng trường hợp query chuỗi đơn giản)
        categorySlugs = [category.toLowerCase()];
      }
    } catch (err) {
      console.error('Error fetching category descendants:', err);
      categorySlugs = [category.toLowerCase()];
    }
  }

  // Xây dựng query filter
  const query = buildProductQuery({
    category,
    categorySlugs, // Truyền danh sách slugs xuống
    search,
    minPrice,
    maxPrice,
    inStock,
    minRating
  });

  // Sort options
  const sortOptions = buildSortOptions(sort, order);

  // Tính toán pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  // Lấy sản phẩm với pagination
  const products = await Product.find(query)
    .select('-reviews') // Không trả về reviews để giảm payload
    .skip(skip)
    .limit(limitNum)
    .sort(sortOptions);

  // Đếm tổng số sản phẩm thỏa điều kiện
  const total = await Product.countDocuments(query);

  // Lấy danh sách categories có sản phẩm (chỉ lấy top level hoặc distinct values)
  const categories = await Product.distinct('category', query);

  return {
    products,
    pagination: {
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: parseInt(page),
      limit: limitNum,
      hasNext: skip + limitNum < total,
      hasPrev: parseInt(page) > 1
    },
    filters: {
      categories,
      priceRange: {
        min: minPrice ? Number(minPrice) : null,
        max: maxPrice ? Number(maxPrice) : null
      }
    }
  };
};

/**
 * Lấy chi tiết một product
 */
export const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate('seller', 'name email');

  if (!product) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Reviews đã được tách ra collection riêng (không embedded trong Product model)
  // Để tương thích với frontend, trả về reviewStats rỗng dựa trên fields hiện có.
  const reviewStats = {
    total: Number(product.reviewCount) || 0,
    average: Number(product.rating) || 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };

  return { product, reviewStats };
};

/**
 * Tạo product mới
 */
export const createProduct = async (productData, sellerId) => {
  const { name, description, price, originalPrice, category, image, stock } = productData;

  // Validation: Kiểm tra các trường bắt buộc
  if (!name || !price || !category) {
    throw new Error('Vui lòng nhập đủ tên, giá và danh mục sản phẩm');
  }

  // Validation: Giá phải là số dương
  if (isNaN(price) || price <= 0) {
    throw new Error('Giá sản phẩm phải là số dương');
  }

  // Tạo sản phẩm mới
  const product = new Product({
    name,
    description,
    price,
    originalPrice: originalPrice || price,
    category,
    image,
    stock: stock || 0,
    seller: sellerId
  });

  await product.save();

  return product;
};

/**
 * Cập nhật product
 */
export const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  return product;
};

/**
 * Xóa product
 */
export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  return product;
};

/**
 * Thêm review cho product
 */
export const addProductReview = async (productId, userId, reviewData) => {
  const { rating, comment } = reviewData;

  // Validation
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Đánh giá phải từ 1 đến 5 sao');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Kiểm tra xem user đã review chưa
  const existingReview = product.reviews.find(
    review => review.user.toString() === userId
  );

  if (existingReview) {
    // Cập nhật review cũ
    existingReview.rating = parseInt(rating);
    existingReview.comment = comment || '';
    existingReview.createdAt = new Date();
  } else {
    // Thêm review mới
    product.reviews.push({
      user: userId,
      rating: parseInt(rating),
      comment: comment || '',
      createdAt: new Date()
    });
  }

  // Tính lại điểm đánh giá trung bình (làm tròn 1 chữ số thập phân)
  const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
  product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;

  await product.save();

  // Populate user info để trả về
  await product.populate('reviews.user', 'name email');

  return {
    product,
    isUpdate: !!existingReview
  };
};

/**
 * Lấy danh sách reviews của product
 */
export const getProductReviews = async (productId, options = {}) => {
  const { page = 1, limit = 10, sort = 'newest' } = options;

  const product = await Product.findById(productId)
    .populate('reviews.user', 'name email')
    .select('reviews rating');

  if (!product) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  let reviews = [...product.reviews];

  // Sort reviews
  if (sort === 'newest') {
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'oldest') {
    reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === 'highest') {
    reviews.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'lowest') {
    reviews.sort((a, b) => a.rating - b.rating);
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  const paginatedReviews = reviews.slice(skip, skip + limitNum);

  return {
    reviews: paginatedReviews,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: reviews.length,
      pages: Math.ceil(reviews.length / limitNum)
    },
    rating: product.rating,
    totalReviews: reviews.length
  };
};

/**
 * Build product query từ filters
 */
const buildProductQuery = (filters) => {
  const { category, categorySlugs, search, minPrice, maxPrice, inStock, minRating } = filters;
  let query = {
    status: 'active' // Chỉ lấy sản phẩm active
  };

  // Filter theo category
  if (categorySlugs && categorySlugs.length > 0) {
    // Tìm trong category, subcategory, và productLine với danh sách slugs (bao gồm descendants)
    query.$or = [
      { category: { $in: categorySlugs } },
      { subcategory: { $in: categorySlugs } },
      { productLine: { $in: categorySlugs } }
    ];
  } else if (category && category !== 'all') {
    // Fallback: Tìm chính xác nếu không có descendants list
    query.$or = [
      { category: category.toLowerCase() },
      { subcategory: category.toLowerCase() },
      { productLine: category.toLowerCase() }
    ];
  }

  // Tìm kiếm theo tên (không phân biệt hoa thường)
  if (search) {
    // Nếu đã có $or từ category, cần kết hợp với $and
    if (query.$or) {
      query.$and = [
        { $or: query.$or },
        { name: { $regex: search, $options: 'i' } }
      ];
      delete query.$or;
    } else {
      query.name = { $regex: search, $options: 'i' };
    }
  }

  // Filter theo giá
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Filter theo stock
  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  // Filter theo rating
  if (minRating) {
    query.rating = { $gte: Number(minRating) };
  }

  return query;
};

/**
 * Build sort options
 */
const buildSortOptions = (sort, order) => {
  let sortOptions = {};
  if (sort === 'price') {
    sortOptions.price = order === 'asc' ? 1 : -1;
  } else if (sort === 'rating') {
    sortOptions.rating = order === 'asc' ? 1 : -1;
  } else if (sort === 'name') {
    sortOptions.name = order === 'asc' ? 1 : -1;
  } else {
    // newest hoặc default
    sortOptions.createdAt = order === 'asc' ? 1 : -1;
  }
  return sortOptions;
};

/**
 * Lấy product theo slug
 */
export const getProductBySlug = async (slug) => {
  let product = await Product.findOne({ slug, status: 'active' });

  // Fallback: Tìm theo ID nếu slug không tồn tại và chuỗi là ID hợp lệ
  if (!product && mongoose.isValidObjectId(slug)) {
    product = await Product.findOne({ _id: slug, status: 'active' });
  }

  if (!product) {
    throw new Error('Không tìm thấy sản phẩm');
  }

  const reviewStats = {
    total: Number(product.reviewCount) || 0,
    average: Number(product.rating) || 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };

  return { product, reviewStats };
};

/**
 * Lấy products theo category
 */
export const getProductsByCategory = async (category, options = {}) => {
  const { page = 1, limit = 12, sort = 'newest', order = 'desc' } = options;

  const query = {
    category: category.toLowerCase(),
    status: 'active'
  };

  const sortOptions = buildSortOptions(sort, order);
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  const products = await Product.find(query)
    .skip(skip)
    .limit(limitNum)
    .sort(sortOptions);

  const total = await Product.countDocuments(query);

  return {
    products,
    pagination: {
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: parseInt(page),
      limit: limitNum,
      hasNext: skip + limitNum < total,
      hasPrev: parseInt(page) > 1
    }
  };
};

/**
 * Tìm kiếm products
 */
export const searchProducts = async (options = {}) => {
  const { q = '', page = 1, limit = 12 } = options;

  if (!q) {
    return { products: [], pagination: { total: 0, pages: 0, currentPage: 1, limit: 12 } };
  }

  const query = {
    status: 'active',
    name: { $regex: q, $options: 'i' }
  };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  const products = await Product.find(query)
    .skip(skip)
    .limit(limitNum)
    .sort({ rating: -1, createdAt: -1 });

  const total = await Product.countDocuments(query);

  return {
    products,
    pagination: {
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: parseInt(page),
      limit: limitNum
    },
    query: q
  };
};

/**
 * Lấy featured products
 */
export const getFeaturedProducts = async (options = {}) => {
  const { limit = 8 } = options;

  const products = await Product.find({
    featured: true,
    status: 'active'
  })
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  return { products };
};

