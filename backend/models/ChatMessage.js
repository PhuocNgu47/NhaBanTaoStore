/**
 * ChatMessage Model
 * Stores chat messages between customers and admin/AI
 */

import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    // Session/conversation identifier
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    // Customer's guestId (from localStorage)
    guestId: {
        type: String,
        index: true
    },
    // Customer info if available
    customerInfo: {
        name: { type: String, default: null },
        phone: { type: String, default: null },
        email: { type: String, default: null }
    },
    // Message content
    message: {
        type: String,
        required: true
    },
    // Who sent this message
    sender: {
        type: String,
        enum: ['customer', 'ai', 'admin'],
        required: true
    },
    // Admin user who responded (if sender is 'admin')
    adminUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // Has admin read this message?
    isRead: {
        type: Boolean,
        default: false
    },
    // Conversation status
    status: {
        type: String,
        enum: ['active', 'resolved', 'pending'],
        default: 'active'
    },
    // Additional metadata
    metadata: {
        userAgent: String,
        page: String, // Page where chat was initiated
        ip: String
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
chatMessageSchema.index({ createdAt: -1 });
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });
chatMessageSchema.index({ isRead: 1, sender: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
