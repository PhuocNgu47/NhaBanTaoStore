import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';

/**
 * Get activity logs with pagination and filters
 * GET /api/activity-logs
 */
export const getActivityLogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            userId,
            action,
            resource,
            startDate,
            endDate
        } = req.query;

        const query = {};

        // Filter by User
        if (userId) {
            query.user = userId;
        }

        // Filter by Action (regex search)
        if (action) {
            query.action = { $regex: action, $options: 'i' };
        }

        // Filter by Resource
        if (resource) {
            query.resource = resource;
        }

        // Filter by Date Range
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                // Set end date to end of day
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        const logs = await ActivityLog.find(query)
            .populate('user', 'name email avatar') // Populate user details
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ActivityLog.countDocuments(query);

        res.json({
            success: true,
            logs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get activity logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử hoạt động'
        });
    }
};
