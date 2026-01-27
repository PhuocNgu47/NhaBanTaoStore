import api from './api';

export const shipmentService = {
  // Create shipment
  createShipment: async (orderId, shipmentData) => {
    const response = await api.post('/shipments/create', {
      orderId,
      ...shipmentData
    });
    return response.data;
  },

  // Get shipment by ID
  getShipmentById: async (id) => {
    const response = await api.get(`/shipments/${id}`);
    return response.data;
  },

  // Get shipment by order ID
  getShipmentByOrderId: async (orderId) => {
    const response = await api.get(`/shipments/order/${orderId}`);
    return response.data;
  },

  // Get shipment by tracking code (public)
  getShipmentByTrackingCode: async (trackingCode) => {
    const response = await api.get(`/shipments/track/${trackingCode}`);
    return response.data;
  },

  // Update tracking
  updateTracking: async (id, trackingData) => {
    const response = await api.put(`/shipments/${id}/track`, trackingData);
    return response.data;
  },

  // Cancel shipment
  cancelShipment: async (id, reason) => {
    const response = await api.post(`/shipments/${id}/cancel`, { reason });
    return response.data;
  },

  // Get shipments list (admin)
  getShipments: async (params = {}) => {
    const response = await api.get('/shipments', { params });
    return response.data;
  },
};
