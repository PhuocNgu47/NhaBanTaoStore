import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
    {
        // User info - Lưu cả ID và thông tin user để dễ tra cứu
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userName: {
            type: String,
            trim: true // Tên user tại thời điểm log
        },
        userEmail: {
            type: String,
            trim: true // Email user tại thời điểm log
        },

        // Action info
        action: {
            type: String,
            required: true,
            trim: true // e.g., 'CREATE_PRODUCT', 'UPDATE_ORDER', 'DELETE_CATEGORY'
        },
        actionLabel: {
            type: String,
            trim: true // Mô tả tiếng Việt: "Tạo sản phẩm mới", "Cập nhật đơn hàng"
        },

        // Resource info
        resource: {
            type: String,
            required: true,
            trim: true // e.g., 'products', 'orders', 'categories'
        },
        resourceId: {
            type: String,
            trim: true // ID của record bị tác động
        },
        resourceName: {
            type: String,
            trim: true // Tên resource: "iPhone 15 Pro Max", "Đơn hàng #123"
        },

        // Data changes - QUAN TRỌNG để điều tra
        beforeData: {
            type: mongoose.Schema.Types.Mixed,
            default: null // Dữ liệu TRƯỚC khi thay đổi (cho UPDATE, DELETE)
        },
        afterData: {
            type: mongoose.Schema.Types.Mixed,
            default: null // Dữ liệu SAU khi thay đổi (cho CREATE, UPDATE)
        },
        changedFields: {
            type: [String],
            default: [] // Danh sách các field đã thay đổi
        },

        // Request info
        details: {
            type: mongoose.Schema.Types.Mixed,
            default: {} // Chi tiết khác: params, query, response message
        },
        ip: {
            type: String,
            trim: true
        },
        userAgent: {
            type: String,
            trim: true
        },

        // Status
        status: {
            type: String,
            enum: ['success', 'failure'],
            default: 'success'
        },
        method: {
            type: String, // HTTP method: POST, PUT, DELETE, PATCH
            trim: true
        },
        path: {
            type: String, // API path
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Index để search nhanh
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ resource: 1, resourceId: 1 });
activityLogSchema.index({ createdAt: -1 }); // Để query logs gần đây
activityLogSchema.index({ userName: 'text', actionLabel: 'text', resourceName: 'text' }); // Full-text search

// Virtual để format thời gian
activityLogSchema.virtual('formattedTime').get(function () {
    return this.createdAt?.toLocaleString('vi-VN');
});

// Static method để lấy logs với filter
activityLogSchema.statics.getLogsWithFilter = async function (filters = {}) {
    const {
        userId,
        action,
        resource,
        startDate,
        endDate,
        status,
        limit = 50,
        skip = 0
    } = filters;

    const query = {};

    if (userId) query.user = userId;
    if (action) query.action = action;
    if (resource) query.resource = resource;
    if (status) query.status = status;

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    return this.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
};

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
