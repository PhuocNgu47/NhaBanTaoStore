/**
 * Order Mapper
 * Transform data giữa database model và API response
 */

/**
 * Map Order từ database sang API response
 */
export const mapOrderToResponse = (order) => {
  if (!order) return null;
  
  return {
    id: order._id,
    orderNumber: order.orderNumber,
    userId: order.userId?._id || order.userId,
    userName: order.userId?.name,
    userEmail: order.userId?.email || order.guestEmail,
    items: order.items?.map(item => ({
      productId: item.productId?._id || item.productId,
      productName: item.productId?.name,
      productImage: item.productId?.image,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price
    })) || [],
    totalAmount: order.totalAmount,
    discountAmount: order.discountAmount || 0,
    couponCode: order.couponCode,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    statusHistory: order.statusHistory || [],
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    shippedAt: order.shippedAt,
    deliveredAt: order.deliveredAt
  };
};

/**
 * Map Order list
 */
export const mapOrderList = (orders) => {
  return orders.map(mapOrderToResponse).filter(Boolean);
};

/**
 * Map Order từ request body sang database model
 */
export const mapRequestToOrder = (body, userId = null) => {
  return {
    userId: userId || null,
    guestEmail: body.guestEmail || null,
    items: body.items?.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    })) || [],
    shippingAddress: body.shippingAddress,
    paymentMethod: body.paymentMethod || 'cash_on_delivery',
    couponCode: body.couponCode || null
  };
};

