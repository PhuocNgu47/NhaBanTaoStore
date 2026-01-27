/**
 * Tracking Service
 * Business logic for customer behavior tracking and lead generation
 */

import Lead from '../models/Lead.js';
import Product from '../models/Product.js';

/**
 * Track product view
 * Find or create Lead by guestId, add product to viewedProducts, update interest score
 */
export const trackProductView = async (guestId, productData) => {
  if (!guestId || !productData) {
    throw new Error('guestId and productData are required');
  }

  // Find or create Lead
  let lead = await Lead.findOne({ guestId });
  
  if (!lead) {
    lead = new Lead({
      guestId,
      viewedProducts: [],
      interestScore: new Map(),
      tags: []
    });
  }

  // Add product to viewedProducts (avoid duplicates in same session)
  const existingView = lead.viewedProducts.find(
    p => p.productId.toString() === productData.productId.toString() &&
         new Date() - new Date(p.timestamp) < 60000 // Same product viewed within 1 minute
  );

  if (!existingView) {
    lead.viewedProducts.push({
      productId: productData.productId,
      productName: productData.productName,
      category: productData.category,
      price: productData.price,
      timestamp: new Date()
    });
  }

  // Recalculate interest score
  const categoryCounts = {};
  lead.viewedProducts.forEach(view => {
    const category = view.category || 'Unknown';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  // Update interestScore Map
  lead.interestScore = new Map(Object.entries(categoryCounts));

  // Determine top interest
  if (Object.keys(categoryCounts).length > 0) {
    lead.topInterest = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)[0][0];
  }

  // Prediction Logic: High Spender tag
  // If user views items > 10 million VND mostly, set tag "High Spender"
  const highValueViews = lead.viewedProducts.filter(v => v.price > 10000000);
  const totalViews = lead.viewedProducts.length;
  
  if (totalViews > 0 && (highValueViews.length / totalViews) > 0.5) {
    if (!lead.tags) {
      lead.tags = [];
    }
    if (!lead.tags.includes('High Spender')) {
      lead.tags.push('High Spender');
    }
  }

  // Update lastActive
  lead.lastActive = new Date();

  // Keep only last 100 viewed products to prevent unbounded growth
  if (lead.viewedProducts.length > 100) {
    lead.viewedProducts = lead.viewedProducts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 100);
  }

  await lead.save();
  return lead;
};

/**
 * Identify lead with contact information
 * Update info field (phone, email, name) for a Lead
 */
export const identifyLead = async (guestId, contactData) => {
  if (!guestId) {
    throw new Error('guestId is required');
  }

  // Find or create Lead
  let lead = await Lead.findOne({ guestId });
  
  if (!lead) {
    lead = new Lead({
      guestId,
      viewedProducts: [],
      interestScore: new Map(),
      tags: []
    });
  }

  // Update contact info (only update provided fields)
  if (contactData.name) {
    lead.info.name = contactData.name;
  }
  if (contactData.email) {
    lead.info.email = contactData.email;
  }
  if (contactData.phone) {
    lead.info.phone = contactData.phone;
  }

  lead.lastActive = new Date();
  await lead.save();
  return lead;
};

/**
 * Get leads for admin dashboard
 * Return list of Leads sorted by lastActive (descending)
 * Filter: Show only leads with info.phone (actionable leads)
 */
export const getLeads = async (filters = {}) => {
  const {
    hasPhone = true, // Default: only show leads with phone
    hasEmail = false,
    page = 1,
    limit = 20,
    sort = 'lastActive',
    order = 'desc'
  } = filters;

  // Build query
  const query = {};
  
  if (hasPhone) {
    query['info.phone'] = { $exists: true, $ne: null, $ne: '' };
  }
  
  if (hasEmail) {
    query['info.email'] = { $exists: true, $ne: null, $ne: '' };
  }

  // Sort options
  const sortOptions = {};
  sortOptions[sort] = order === 'desc' ? -1 : 1;

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  // Execute query
  const leads = await Lead.find(query)
    .populate('viewedProducts.productId', 'name image slug')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean(); // Use lean() for better performance

  // Count total
  const total = await Lead.countDocuments(query);

  // Transform interestScore Map to Object for JSON response
  const transformedLeads = leads.map(lead => {
    let interestScoreObj = {};
    if (lead.interestScore) {
      // Handle both Map and Object formats
      if (lead.interestScore instanceof Map) {
        interestScoreObj = Object.fromEntries(lead.interestScore);
      } else if (typeof lead.interestScore === 'object') {
        interestScoreObj = lead.interestScore;
      }
    }
    
    return {
      ...lead,
      interestScore: interestScoreObj,
      viewedCount: lead.viewedProducts?.length || 0
    };
  });

  return {
    leads: transformedLeads,
    pagination: {
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: parseInt(page),
      limit: limitNum,
      hasNext: skip + limitNum < total,
      hasPrev: parseInt(page) > 1
    }
  };
};

/**
 * Get lead statistics
 */
export const getLeadStats = async () => {
  const totalLeads = await Lead.countDocuments();
  const leadsWithPhone = await Lead.countDocuments({ 'info.phone': { $exists: true, $ne: null, $ne: '' } });
  const leadsWithEmail = await Lead.countDocuments({ 'info.email': { $exists: true, $ne: null, $ne: '' } });
  const highSpenderLeads = await Lead.countDocuments({ tags: 'High Spender' });
  
  // Recent leads (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentLeads = await Lead.countDocuments({ lastActive: { $gte: sevenDaysAgo } });

  return {
    totalLeads,
    leadsWithPhone,
    leadsWithEmail,
    highSpenderLeads,
    recentLeads
  };
};
