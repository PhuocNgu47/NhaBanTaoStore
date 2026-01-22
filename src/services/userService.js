import api from './api';

export const userService = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Change password
  changePassword: async (data) => {
    const response = await api.put('/users/profile/password', data);
    return response.data;
  },

  // ==================== ADMIN APIs ====================

  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Get customer stats (admin only)
  getCustomerStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Update loyalty points (admin only)
  updateLoyaltyPoints: async (userId, data) => {
    const response = await api.put(`/users/${userId}/loyalty`, data);
    return response.data;
  },

  // Update customer tier (admin only)
  updateCustomerTier: async (userId, data) => {
    const response = await api.put(`/users/${userId}/tier`, data);
    return response.data;
  },
};

export default userService;
