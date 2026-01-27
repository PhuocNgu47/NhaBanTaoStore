import api from './api';

export const trackingService = {
  /**
   * Track product view
   * @param {string} guestId - Unique guest ID
   * @param {object} productData - Product data to track
   */
  trackView: async (guestId, productData) => {
    try {
      const response = await api.post('/track/view', {
        guestId,
        productData
      });
      return response.data;
    } catch (error) {
      // Silently fail - don't block UI
      console.error('Error tracking view:', error);
      return { success: false };
    }
  },

  /**
   * Identify lead with contact information
   * @param {string} guestId - Unique guest ID
   * @param {object} contactData - Contact data (phone, email, name)
   */
  identifyLead: async (guestId, contactData) => {
    try {
      const response = await api.post('/track/identify', {
        guestId,
        contactData
      });
      return response.data;
    } catch (error) {
      // Silently fail - don't block UI
      console.error('Error identifying lead:', error);
      return { success: false };
    }
  },

  /**
   * Get leads for admin dashboard
   * @param {object} filters - Filter options
   */
  getLeads: async (filters = {}) => {
    try {
      const response = await api.get('/admin/leads', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  /**
   * Get lead statistics
   */
  getLeadStats: async () => {
    try {
      const response = await api.get('/admin/leads/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching lead stats:', error);
      throw error;
    }
  }
};
