/**
 * Product Mapper
 * Transform data giữa database model và API response
 */

/**
 * Map Product từ database sang API response
 */
export const mapProductToResponse = (product) => {
  if (!product) return null;
  
  return {
    _id: product._id,
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    discountPercentage: product.discountPercentage,
    category: product.category,
    brand: product.brand,
    image: product.image,
    images: product.images || [],
    stock: product.stock,
    stockStatus: product.stockStatus,
    rating: product.rating || 0,
    totalReviews: product.reviews?.length || 0,
    featured: product.featured || false,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
};

/**
 * Map Product với reviews
 */
export const mapProductWithReviews = (product) => {
  const mapped = mapProductToResponse(product);
  if (!mapped) return null;
  
  return {
    ...mapped,
    reviews: product.reviews?.map(review => ({
      id: review._id,
      userId: review.user?._id || review.user,
      userName: review.user?.name,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    })) || []
  };
};

/**
 * Map Product list
 */
export const mapProductList = (products) => {
  return products.map(mapProductToResponse).filter(Boolean);
};

/**
 * Map Product từ request body sang database model
 */
export const mapRequestToProduct = (body, sellerId = null) => {
  return {
    name: body.name,
    description: body.description,
    price: body.price,
    originalPrice: body.originalPrice || body.price,
    category: body.category,
    brand: body.brand,
    image: body.image,
    images: body.images || [],
    stock: body.stock || 0,
    featured: body.featured || false,
    seller: sellerId
  };
};

