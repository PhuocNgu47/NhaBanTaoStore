import requestIp from 'request-ip';
import ActivityLog from '../models/ActivityLog.js';
import logger from '../config/logger.js';

/**
 * Middleware to log admin activities usually for state-changing methods (POST, PUT, DELETE)
 */
export const activityLogger = async (req, res, next) => {
    // Chỉ log nếu user đã đăng nhập và là admin
    // Lưu ý: Middleware này phải đặt SAU middleware auth/admin
    if (!req.user || req.user.role !== 'admin') {
        return next();
    }

    // Chỉ log các method thay đổi dữ liệu
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const originalSend = res.send;
        const startTime = Date.now();

        // Hook vào res.send để bắt kết quả trả về (thành công hay thất bại)
        res.send = function (data) {
            // Khôi phục hàm send gốc để response vẫn được gửi đi
            originalSend.apply(res, arguments);

            // Xử lý log sau khi response đã gửi (để không block request)
            const logActivity = async () => {
                try {
                    // Parse response body nếu có thể
                    let details = {};
                    try {
                        const body = typeof data === 'string' ? JSON.parse(data) : data;
                        // Chỉ lưu một số thông tin quan trọng từ response, tránh lưu quá nhiều
                        if (body.success !== undefined) details.success = body.success;
                        if (body.message) details.message = body.message;
                        if (body._id) details.id = body._id; // ID của resource tạo mới
                    } catch (e) {
                        // data không phải JSON hợp lệ
                        details.response = 'Non-JSON response';
                    }

                    // Xác định Action và Resource từ URL
                    // Ví dụ: /api/products/123 -> Resource: products, ID: 123
                    const parts = req.baseUrl.split('/').filter(p => p);
                    // req.baseUrl là phần mount point (vd /api/products), req.path là phần còn lại
                    // Kết hợp:
                    const fullPath = (req.baseUrl + req.path).replace(/\/$/, '');
                    const pathSegments = fullPath.split('/').filter(p => p && p !== 'api');

                    const resource = pathSegments[0] || 'unknown'; // products, orders, categories
                    const action = `${req.method}_${resource.toUpperCase()}`;

                    // Lấy Resource ID từ params hoặc url
                    // Thường ID nằm ở cuối URL cho PUT/DELETE: products/:id
                    const possibleId = pathSegments[pathSegments.length - 1];
                    const resourceId = mongoose.isValidObjectId(possibleId) ? possibleId : (details.id || null);

                    // Lấy client IP
                    const clientIp = requestIp.getClientIp(req);

                    // Tạo log
                    await ActivityLog.create({
                        user: req.user._id,
                        action: action, // e.g., PUT_PRODUCTS
                        resource: resource, // e.g., products
                        resourceId: resourceId,
                        method: req.method,
                        path: fullPath,
                        ip: clientIp,
                        userAgent: req.headers['user-agent'],
                        status: res.statusCode >= 400 ? 'failure' : 'success',
                        details: {
                            ...details,
                            params: req.params,
                            query: req.query,
                            // body: req.body // Cẩn thận với sensitive data trong body! Có thể filter sau
                        }
                    });

                } catch (err) {
                    logger.error('Error saving activity log:', err);
                }
            };

            logActivity();
        };
    }

    next();
};

import mongoose from 'mongoose';
