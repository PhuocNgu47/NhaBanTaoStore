import api from './api';

export const categoryService = {
  // Get all categories (tree structure)
  getCategories: async (params = {}) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  // Get categories flat list
  getCategoriesFlat: async (params = {}) => {
    const response = await api.get('/categories', {
      params: { ...params, flat: 'true' }
    });
    return response.data;
  },

  // Get menu categories (for sidebar)
  getMenuCategories: async () => {
    const response = await api.get('/categories/menu');
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/id/${id}`);
    return response.data;
  },

  // Admin: Create category
  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Admin: Update category
  updateCategory: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // Admin: Delete category
  deleteCategory: async (id, force = false) => {
    const response = await api.delete(`/categories/${id}`, {
      params: force ? { force: 'true' } : {}
    });
    return response.data;
  },

  // Admin: Reorder categories
  reorderCategories: async (orders) => {
    const response = await api.put('/categories/reorder', { orders });
    return response.data;
  },

  // Admin: Sync product counts for all categories
  syncProductCounts: async () => {
    const response = await api.post('/categories/sync-counts');
    return response.data;
  },
};
