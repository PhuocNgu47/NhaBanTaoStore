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
            endDate,
            status,
            search
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

        // Filter by Status
        if (status) {
            query.status = status;
        }

        // Filter by Date Range
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        // Full-text search on userName, actionLabel, resourceName
        if (search) {
            query.$or = [
                { userName: { $regex: search, $options: 'i' } },
                { actionLabel: { $regex: search, $options: 'i' } },
                { resourceName: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } }
            ];
        }

        const logs = await ActivityLog.find(query)
            .populate('user', 'name email avatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        // Format logs for frontend
        const formattedLogs = logs.map(log => ({
            ...log,
            formattedTime: log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : null,
            hasChanges: log.beforeData || log.afterData ? true : false,
            changedFieldsCount: log.changedFields?.length || 0
        }));

        const total = await ActivityLog.countDocuments(query);

        // Get unique resources and actions for filter dropdowns
        const [resources, actions] = await Promise.all([
            ActivityLog.distinct('resource'),
            ActivityLog.distinct('action')
        ]);

        res.json({
            success: true,
            logs: formattedLogs,
            filters: {
                resources: resources.filter(r => r),
                actions: actions.filter(a => a)
            },
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

/**
 * Get single activity log detail with full before/after data
 * GET /api/activity-logs/:id
 */
export const getActivityLogDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const log = await ActivityLog.findById(id)
            .populate('user', 'name email avatar phone')
            .lean();

        if (!log) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy log'
            });
        }

        // Format for display
        const formattedLog = {
            ...log,
            formattedTime: log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : null
        };

        res.json({
            success: true,
            log: formattedLog
        });
    } catch (error) {
        console.error('Get activity log detail error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy chi tiết log'
        });
    }
};

/**
 * Get activity statistics
 * GET /api/activity-logs/stats
 */
export const getActivityStats = async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Thống kê theo ngày
        const dailyStats = await ActivityLog.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    success: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
                    failure: { $sum: { $cond: [{ $eq: ['$status', 'failure'] }, 1, 0] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top users hoạt động nhiều nhất
        const topUsers = await ActivityLog.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$user',
                    userName: { $first: '$userName' },
                    userEmail: { $first: '$userEmail' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Thống kê theo resource
        const resourceStats = await ActivityLog.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$resource',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Thống kê theo action
        const actionStats = await ActivityLog.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$action',
                    actionLabel: { $first: '$actionLabel' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const totalLogs = await ActivityLog.countDocuments({
            createdAt: { $gte: startDate }
        });

        res.json({
            success: true,
            stats: {
                totalLogs,
                dailyStats,
                topUsers,
                resourceStats,
                actionStats
            }
        });
    } catch (error) {
        console.error('Get activity stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê hoạt động'
        });
    }
};

/**
 * Delete old activity logs (cleanup)
 * DELETE /api/activity-logs/cleanup
 */
export const cleanupOldLogs = async (req, res) => {
    try {
        const { daysToKeep = 90 } = req.body;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysToKeep));

        const result = await ActivityLog.deleteMany({
            createdAt: { $lt: cutoffDate }
        });

        res.json({
            success: true,
            message: `Đã xóa ${result.deletedCount} logs cũ hơn ${daysToKeep} ngày`
        });
    } catch (error) {
        console.error('Cleanup logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi dọn dẹp logs'
        });
    }
};
