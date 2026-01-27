/**
 * Chat Routes
 * Public and admin routes for chat functionality
 */

import express from 'express';
import * as chatController from '../controllers/chatController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// ============ PUBLIC ROUTES (for customers) ============

/**
 * POST /api/chat/send
 * Customer sends a message
 */
router.post('/send', chatController.sendMessage);

/**
 * GET /api/chat/history/:sessionId
 * Get chat history for a session
 */
router.get('/history/:sessionId', chatController.getChatHistory);

// ============ ADMIN ROUTES (protected) ============

/**
 * GET /api/chat/admin/conversations
 * Get all conversations for admin
 */
router.get('/admin/conversations', protect, admin, chatController.getConversations);

/**
 * GET /api/chat/admin/conversation/:sessionId
 * Get full conversation for a session
 */
router.get('/admin/conversation/:sessionId', protect, admin, chatController.getConversation);

/**
 * POST /api/chat/admin/reply
 * Admin replies to a conversation
 */
router.post('/admin/reply', protect, admin, chatController.adminReply);

/**
 * PUT /api/chat/admin/status/:sessionId
 * Update conversation status
 */
router.put('/admin/status/:sessionId', protect, admin, chatController.updateStatus);

/**
 * GET /api/chat/admin/stats
 * Get chat statistics
 */
router.get('/admin/stats', protect, admin, chatController.getChatStats);

export default router;
