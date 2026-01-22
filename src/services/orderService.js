import api from './api';

export const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Create order from cart
  createOrderFromCart: async (orderData) => {
    const response = await api.post('/orders/from-cart', orderData);
    return response.data;
  },

  // Get user orders with pagination
  getMyOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Get guest order
  getGuestOrder: async (email, orderNumber) => {
    const response = await api.get(`/orders/guest/${encodeURIComponent(email)}/${orderNumber}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id, reason) => {
    const response = await api.patch(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Admin: Get all orders with filters
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Admin: Get order statistics
  getOrderStats: async (params = {}) => {
    const response = await api.get('/orders/stats', { params });
    return response.data;
  },

  // Admin: Update order status
  updateOrderStatus: async (id, status, note, trackingNumber) => {
    const response = await api.patch(`/orders/${id}/status`, { 
      status, 
      note,
      trackingNumber 
    });
    return response.data;
  },

  // Admin: Update order items
  updateOrderItems: async (id, items) => {
    const response = await api.patch(`/orders/${id}/items`, { items });
    return response.data;
  },

  // Admin: Update full order
  updateOrder: async (id, data) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },
};
