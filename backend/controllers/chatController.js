/**
 * Chat Controller
 * Handles chat message operations for customers and admin
 */

import ChatMessage from '../models/ChatMessage.js';
import * as aiInsightService from '../services/aiInsightService.js';

/**
 * POST /api/chat/send
 * Customer sends a message (public endpoint)
 */
export const sendMessage = async (req, res) => {
    try {
        const { sessionId, guestId, message, customerInfo, metadata } = req.body;

        if (!sessionId || !message) {
            return res.status(400).json({
                success: false,
                message: 'sessionId and message are required'
            });
        }

        // Save customer message
        const customerMessage = await ChatMessage.create({
            sessionId,
            guestId,
            customerInfo,
            message,
            sender: 'customer',
            metadata
        });

        // Generate AI response
        let aiReply;
        try {
            aiReply = await aiInsightService.generateChatResponse(message);
        } catch (err) {
            aiReply = 'Xin lỗi, tôi không thể trả lời ngay. Nhân viên sẽ hỗ trợ bạn sớm nhất!';
        }

        // Save AI response
        const aiMessage = await ChatMessage.create({
            sessionId,
            guestId,
            message: aiReply,
            sender: 'ai'
        });

        res.json({
            success: true,
            customerMessage,
            aiMessage,
            reply: aiReply
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/chat/history/:sessionId
 * Get chat history for a session (public)
 */
export const getChatHistory = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const messages = await ChatMessage.find({ sessionId })
            .sort({ createdAt: 1 })
            .lean();

        res.json({
            success: true,
            messages
        });
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/admin/chat/conversations
 * Get all conversations for admin (protected)
 */
export const getConversations = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        // Get unique sessions with latest message
        const pipeline = [
            ...(status ? [{ $match: { status } }] : []),
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$sessionId',
                    lastMessage: { $first: '$message' },
                    lastSender: { $first: '$sender' },
                    lastTime: { $first: '$createdAt' },
                    customerInfo: { $first: '$customerInfo' },
                    guestId: { $first: '$guestId' },
                    status: { $first: '$status' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ['$sender', 'customer'] }, { $eq: ['$isRead', false] }] },
                                1,
                                0
                            ]
                        }
                    },
                    totalMessages: { $sum: 1 }
                }
            },
            { $sort: { lastTime: -1 } },
            { $skip: (parseInt(page) - 1) * parseInt(limit) },
            { $limit: parseInt(limit) }
        ];

        const conversations = await ChatMessage.aggregate(pipeline);

        // Get total count
        const totalPipeline = [
            ...(status ? [{ $match: { status } }] : []),
            { $group: { _id: '$sessionId' } },
            { $count: 'total' }
        ];
        const countResult = await ChatMessage.aggregate(totalPipeline);
        const total = countResult[0]?.total || 0;

        // Get unread count
        const unreadCount = await ChatMessage.countDocuments({
            sender: 'customer',
            isRead: false
        });

        res.json({
            success: true,
            conversations,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            },
            unreadCount
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/admin/chat/conversation/:sessionId
 * Get full conversation for a session (protected)
 */
export const getConversation = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const messages = await ChatMessage.find({ sessionId })
            .populate('adminUser', 'name email')
            .sort({ createdAt: 1 })
            .lean();

        // Mark customer messages as read
        await ChatMessage.updateMany(
            { sessionId, sender: 'customer', isRead: false },
            { isRead: true }
        );

        res.json({
            success: true,
            sessionId,
            messages
        });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * POST /api/admin/chat/reply
 * Admin replies to a conversation (protected)
 */
export const adminReply = async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        const adminId = req.user.id || req.user._id;

        if (!sessionId || !message) {
            return res.status(400).json({
                success: false,
                message: 'sessionId and message are required'
            });
        }

        const adminMessage = await ChatMessage.create({
            sessionId,
            message,
            sender: 'admin',
            adminUser: adminId
        });

        res.json({
            success: true,
            message: adminMessage
        });
    } catch (error) {
        console.error('Admin reply error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * PUT /api/admin/chat/status/:sessionId
 * Update conversation status (protected)
 */
export const updateStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { status } = req.body;

        await ChatMessage.updateMany(
            { sessionId },
            { status }
        );

        res.json({
            success: true,
            message: 'Status updated'
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * GET /api/admin/chat/stats
 * Get chat statistics (protected)
 */
export const getChatStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = await ChatMessage.aggregate([
            {
                $facet: {
                    total: [{ $group: { _id: '$sessionId' } }, { $count: 'count' }],
                    today: [
                        { $match: { createdAt: { $gte: today } } },
                        { $group: { _id: '$sessionId' } },
                        { $count: 'count' }
                    ],
                    unread: [
                        { $match: { sender: 'customer', isRead: false } },
                        { $count: 'count' }
                    ],
                    byStatus: [
                        { $group: { _id: { session: '$sessionId', status: '$status' } } },
                        { $group: { _id: '$_id.status', count: { $sum: 1 } } }
                    ]
                }
            }
        ]);

        const result = stats[0];

        res.json({
            success: true,
            stats: {
                totalConversations: result.total[0]?.count || 0,
                todayConversations: result.today[0]?.count || 0,
                unreadMessages: result.unread[0]?.count || 0,
                byStatus: result.byStatus.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        console.error('Get chat stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
