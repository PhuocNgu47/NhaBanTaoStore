/**
 * AI Insight Controller
 * Handles HTTP requests for AI-Driven Customer Insights
 */

import * as aiInsightService from '../services/aiInsightService.js';
import Lead from '../models/Lead.js';

/**
 * GET /api/admin/ai-insights/lead/:id
 * Get AI insights for a specific lead
 */
export const getLeadInsight = async (req, res) => {
    try {
        const { id } = req.params;

        const lead = await Lead.findById(id).lean();
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }

        const insights = await aiInsightService.analyzeLeadBehavior(lead);

        res.json({
            success: true,
            leadId: id,
            insights
        });
    } catch (error) {
        console.error('Get lead insight error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error generating AI insights'
        });
    }
};

/**
 * POST /api/admin/ai-insights/batch
 * Get AI insights for multiple leads
 */
export const batchLeadInsights = async (req, res) => {
    try {
        const { leadIds } = req.body;

        if (!leadIds || !Array.isArray(leadIds)) {
            return res.status(400).json({
                success: false,
                message: 'leadIds array is required'
            });
        }

        // Limit batch size to prevent API abuse
        if (leadIds.length > 10) {
            return res.status(400).json({
                success: false,
                message: 'Maximum 10 leads per batch'
            });
        }

        const results = await aiInsightService.batchAnalyzeLeads(leadIds);

        res.json({
            success: true,
            results
        });
    } catch (error) {
        console.error('Batch insights error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error generating batch insights'
        });
    }
};

/**
 * GET /api/admin/ai-insights/market
 * Get market-level AI insights
 */
export const getMarketInsights = async (req, res) => {
    try {
        const result = await aiInsightService.generateMarketInsights();

        res.json(result);
    } catch (error) {
        console.error('Market insights error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error generating market insights'
        });
    }
};

/**
 * POST /api/ai-insights/chat
 * Public endpoint - AI chat for customers
 */
export const chatWithCustomer = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const reply = await aiInsightService.generateChatResponse(message);

        res.json({
            success: true,
            reply
        });
    } catch (error) {
        console.error('Chat response error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error generating chat response'
        });
    }
};
