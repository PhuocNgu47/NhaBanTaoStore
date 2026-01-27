/**
 * Tracking Controller
 * Handles HTTP requests for customer behavior tracking
 */

import * as trackingService from '../services/trackingService.js';

/**
 * POST /api/track/view
 * Track product view
 */
export const trackView = async (req, res) => {
  try {
    const { guestId, productData } = req.body;

    if (!guestId || !productData) {
      return res.status(400).json({
        success: false,
        message: 'guestId and productData are required'
      });
    }

    const lead = await trackingService.trackProductView(guestId, productData);

    res.json({
      success: true,
      message: 'Product view tracked successfully',
      lead: {
        guestId: lead.guestId,
        topInterest: lead.topInterest,
        tags: lead.tags,
        viewedCount: lead.viewedProducts.length
      }
    });
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error tracking product view'
    });
  }
};

/**
 * POST /api/track/identify
 * Identify lead with contact information
 */
export const identifyLead = async (req, res) => {
  try {
    const { guestId, contactData } = req.body;

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: 'guestId is required'
      });
    }

    if (!contactData || (!contactData.phone && !contactData.email && !contactData.name)) {
      return res.status(400).json({
        success: false,
        message: 'At least one contact field (phone, email, or name) is required'
      });
    }

    const lead = await trackingService.identifyLead(guestId, contactData);

    res.json({
      success: true,
      message: 'Lead identified successfully',
      lead: {
        guestId: lead.guestId,
        info: lead.info,
        topInterest: lead.topInterest,
        tags: lead.tags
      }
    });
  } catch (error) {
    console.error('Identify lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error identifying lead'
    });
  }
};

/**
 * GET /api/admin/leads
 * Get leads for admin dashboard
 */
export const getLeads = async (req, res) => {
  try {
    const filters = {
      hasPhone: req.query.hasPhone !== 'false', // Default true
      hasEmail: req.query.hasEmail === 'true',
      page: req.query.page || 1,
      limit: req.query.limit || 20,
      sort: req.query.sort || 'lastActive',
      order: req.query.order || 'desc'
    };

    const result = await trackingService.getLeads(filters);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching leads'
    });
  }
};

/**
 * GET /api/admin/leads/stats
 * Get lead statistics
 */
export const getLeadStats = async (req, res) => {
  try {
    const stats = await trackingService.getLeadStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get lead stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching lead statistics'
    });
  }
};
