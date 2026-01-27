import api from './api';

export const addressService = {
  // Get all addresses of current user
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  // Get address by ID
  getAddressById: async (id) => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  // Create new address
  createAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  // Update address
  updateAddress: async (id, addressData) => {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },

  // Set address as default
  setDefaultAddress: async (id) => {
    const response = await api.patch(`/addresses/${id}/set-default`);
    return response.data;
  },
};

export default addressService;
