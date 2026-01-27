import api from './api';
import { API_URL } from '../constants';

export const bannerService = {
  // Get active banners (public)
  getBanners: async () => {
    const response = await api.get('/banners');
    return response.data;
  },

  // Get all banners (admin)
  getAllBanners: async (params = {}) => {
    const response = await api.get('/banners/admin', { params });
    return response.data;
  },

  // Get banner by ID
  getBannerById: async (id) => {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  },

  // Create banner (admin)
  createBanner: async (bannerData) => {
    const formData = new FormData();
    
    // Append all fields
    Object.keys(bannerData).forEach((key) => {
      if (key !== 'image' || bannerData[key] instanceof File) {
        formData.append(key, bannerData[key]);
      }
    });
    
    // Append image file if exists
    if (bannerData.image instanceof File) {
      formData.append('image', bannerData.image);
    } else if (bannerData.image) {
      formData.append('image', bannerData.image);
    }
    
    const response = await api.post('/banners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update banner (admin)
  updateBanner: async (id, bannerData) => {
    const formData = new FormData();
    
    // Append all fields
    Object.keys(bannerData).forEach((key) => {
      if (key !== 'image' || bannerData[key] instanceof File) {
        formData.append(key, bannerData[key]);
      }
    });
    
    // Append image file if exists
    if (bannerData.image instanceof File) {
      formData.append('image', bannerData.image);
    } else if (bannerData.image && !bannerData.image.startsWith('http')) {
      formData.append('image', bannerData.image);
    }
    
    const response = await api.put(`/banners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete banner (admin)
  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  // Reorder banners (admin)
  reorderBanners: async (bannerOrders) => {
    const response = await api.put('/banners/reorder', { bannerOrders });
    return response.data;
  },
};
