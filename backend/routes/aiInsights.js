/**
 * AI Insights Routes (Admin only)
 * Routes for AI-Driven Customer Insights
 */

import express from 'express';
import * as aiInsightController from '../controllers/aiInsightController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/admin/ai-insights/chat
 * Public chat endpoint for customers (no auth required)
 */
router.post('/chat', aiInsightController.chatWithCustomer);

/**
 * GET /api/admin/ai-insights/lead/:id
 * Get AI insights for a specific lead
 */
router.get('/lead/:id', protect, admin, aiInsightController.getLeadInsight);

/**
 * POST /api/admin/ai-insights/batch
 * Get AI insights for multiple leads (max 10)
 */
router.post('/batch', protect, admin, aiInsightController.batchLeadInsights);

/**
 * GET /api/admin/ai-insights/market
 * Get market-level AI insights
 */
router.get('/market', protect, admin, aiInsightController.getMarketInsights);

export default router;

