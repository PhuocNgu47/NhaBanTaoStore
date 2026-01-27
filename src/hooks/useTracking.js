import { useCallback } from 'react';
import { trackingService } from '../services/trackingService';

/**
 * Generate or retrieve guestId from localStorage
 */
const getOrCreateGuestId = () => {
  const STORAGE_KEY = 'guestId';
  let guestId = localStorage.getItem(STORAGE_KEY);
  
  if (!guestId) {
    // Generate UUID v4
    guestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem(STORAGE_KEY, guestId);
  }
  
  return guestId;
};

/**
 * useTracking Hook
 * Provides tracking functionality for customer behavior
 */
export const useTracking = () => {
  /**
   * Track product view
   * @param {object} product - Product object with id, name, category, price
   */
  const trackView = useCallback(async (product) => {
    if (!product || !product._id) {
      console.warn('Invalid product data for tracking');
      return;
    }

    try {
      const guestId = getOrCreateGuestId();
      
      const productData = {
        productId: product._id,
        productName: product.name || 'Unknown',
        category: product.category?.name || product.category || 'Unknown',
        price: product.price || product.variants?.[0]?.price || 0
      };

      // Track asynchronously - don't block UI
      trackingService.trackView(guestId, productData).catch(err => {
        // Silently fail - tracking should never break the app
        console.error('Tracking error (silent):', err);
      });
    } catch (error) {
      // Silently fail
      console.error('Tracking error (silent):', error);
    }
  }, []);

  /**
   * Identify lead with contact information
   * @param {object} contactData - Object with phone, email, and/or name
   */
  const identifyLead = useCallback(async (contactData) => {
    if (!contactData || (!contactData.phone && !contactData.email && !contactData.name)) {
      return;
    }

    try {
      const guestId = getOrCreateGuestId();
      
      // Track asynchronously - don't block UI
      trackingService.identifyLead(guestId, contactData).catch(err => {
        // Silently fail
        console.error('Lead identification error (silent):', err);
      });
    } catch (error) {
      // Silently fail
      console.error('Lead identification error (silent):', error);
    }
  }, []);

  /**
   * Get current guestId
   */
  const getGuestId = useCallback(() => {
    return getOrCreateGuestId();
  }, []);

  return {
    trackView,
    identifyLead,
    getGuestId
  };
};
