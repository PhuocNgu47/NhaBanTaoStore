import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        action: {
            type: String,
            required: true,
            trim: true // e.g., 'CREATE_PRODUCT', 'UPDATE_ORDER'
        },
        resource: {
            type: String,
            required: true,
            trim: true // e.g., 'Product', 'Order', 'Category'
        },
        resourceId: {
            type: String,
            trim: true // ID của record bị tác động
        },
        details: {
            type: mongoose.Schema.Types.Mixed,
            default: {} // Chi tiết thay đổi hoặc thông tin thêm
        },
        ip: {
            type: String,
            trim: true
        },
        userAgent: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ['success', 'failure'],
            default: 'success'
        },
        method: {
            type: String, // HTTP method: POST, PUT, DELETE
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

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
