import requestIp from 'request-ip';
import mongoose from 'mongoose';
import ActivityLog from '../models/ActivityLog.js';
import logger from '../config/logger.js';

// Map action sang tiếng Việt
const ACTION_LABELS = {
    'POST_PRODUCTS': 'Tạo sản phẩm mới',
    'PUT_PRODUCTS': 'Cập nhật sản phẩm',
    'PATCH_PRODUCTS': 'Cập nhật sản phẩm',
    'DELETE_PRODUCTS': 'Xóa sản phẩm',
    'POST_CATEGORIES': 'Tạo danh mục mới',
    'PUT_CATEGORIES': 'Cập nhật danh mục',
    'DELETE_CATEGORIES': 'Xóa danh mục',
    'POST_ORDERS': 'Tạo đơn hàng',
    'PUT_ORDERS': 'Cập nhật đơn hàng',
    'PATCH_ORDERS': 'Cập nhật trạng thái đơn hàng',
    'DELETE_ORDERS': 'Xóa đơn hàng',
    'POST_USERS': 'Tạo người dùng',
    'PUT_USERS': 'Cập nhật người dùng',
    'DELETE_USERS': 'Xóa người dùng',
    'POST_BANNERS': 'Tạo banner mới',
    'PUT_BANNERS': 'Cập nhật banner',
    'DELETE_BANNERS': 'Xóa banner',
    'POST_SETTINGS': 'Cập nhật cài đặt',
    'PUT_SETTINGS': 'Cập nhật cài đặt',
    'POST_LEADS': 'Tạo lead mới',
    'PUT_LEADS': 'Cập nhật lead',
    'DELETE_LEADS': 'Xóa lead',
};

// Map resource sang model name
const RESOURCE_MODELS = {
    'products': 'Product',
    'categories': 'Category',
    'orders': 'Order',
    'users': 'User',
    'banners': 'Banner',
    'leads': 'Lead',
    'settings': 'Setting',
};

/**
 * Lấy dữ liệu hiện tại của resource trước khi update/delete
 */
async function getBeforeData(resource, resourceId) {
    try {
        const modelName = RESOURCE_MODELS[resource];
        if (!modelName || !resourceId || !mongoose.isValidObjectId(resourceId)) {
            return null;
        }

        const Model = mongoose.model(modelName);
        const doc = await Model.findById(resourceId).lean();

        if (!doc) return null;

        // Chỉ lấy các field quan trọng để log, tránh data quá lớn
        const essentialFields = ['name', 'title', 'email', 'status', 'price', 'stock', 'role', 'slug', 'phone'];
        const filtered = {};

        for (const field of essentialFields) {
            if (doc[field] !== undefined) {
                filtered[field] = doc[field];
            }
        }

        // Thêm một số field đặc biệt
        if (doc.variants?.length) {
            filtered.variantsCount = doc.variants.length;
        }

        return Object.keys(filtered).length > 0 ? filtered : { _id: doc._id };
    } catch (err) {
        logger.error('Error getting before data:', err);
        return null;
    }
}

/**
 * Lấy tên của resource từ data
 */
function getResourceName(resource, data) {
    if (!data) return null;

    switch (resource) {
        case 'products':
            return data.name || data.title;
        case 'categories':
            return data.name;
        case 'orders':
            return `Đơn hàng #${data._id?.toString().slice(-6) || 'N/A'}`;
        case 'users':
            return data.name || data.email;
        case 'banners':
            return data.title || data.name;
        case 'leads':
            return data.name || data.email || data.phone;
        default:
            return data.name || data.title || null;
    }
}

/**
 * Tìm các field đã thay đổi
 */
function findChangedFields(before, after) {
    if (!before || !after) return [];

    const changed = [];
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

    for (const key of allKeys) {
        if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
            changed.push(key);
        }
    }

    return changed;
}

/**
 * Middleware to log admin activities with detailed before/after data
 */
export const activityLogger = async (req, res, next) => {
    // Chỉ log nếu user đã đăng nhập và là admin
    if (!req.user || req.user.role !== 'admin') {
        return next();
    }

    // Chỉ log các method thay đổi dữ liệu
    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        return next();
    }

    // Xác định resource và ID từ URL
    const fullPath = (req.baseUrl + req.path).replace(/\/$/, '');
    const pathSegments = fullPath.split('/').filter(p => p && p !== 'api');
    const resource = pathSegments[0] || 'unknown';

    // Lấy Resource ID từ params hoặc url
    const possibleId = pathSegments[pathSegments.length - 1];
    const resourceId = mongoose.isValidObjectId(possibleId) ? possibleId : null;

    // Lấy beforeData cho UPDATE và DELETE
    let beforeData = null;
    let resourceName = null;

    if (['PUT', 'PATCH', 'DELETE'].includes(req.method) && resourceId) {
        beforeData = await getBeforeData(resource, resourceId);
        resourceName = getResourceName(resource, beforeData);
    }

    const originalSend = res.send;
    const startTime = Date.now();

    // Hook vào res.send để bắt kết quả
    res.send = function (data) {
        originalSend.apply(res, arguments);

        const logActivity = async () => {
            try {
                // Parse response body
                let responseData = {};
                let afterData = null;

                try {
                    const body = typeof data === 'string' ? JSON.parse(data) : data;

                    if (body.success !== undefined) responseData.success = body.success;
                    if (body.message) responseData.message = body.message;

                    // Lấy afterData từ response (cho CREATE và UPDATE)
                    if (body.data || body.product || body.category || body.order || body.user) {
                        const resultData = body.data || body.product || body.category || body.order || body.user;
                        afterData = {};

                        const essentialFields = ['name', 'title', 'email', 'status', 'price', 'stock', 'role', 'slug', 'phone', '_id'];
                        for (const field of essentialFields) {
                            if (resultData[field] !== undefined) {
                                afterData[field] = resultData[field];
                            }
                        }

                        // Lấy resource name từ after data nếu chưa có
                        if (!resourceName) {
                            resourceName = getResourceName(resource, resultData);
                        }
                    }

                    if (body._id) {
                        responseData.id = body._id;
                        if (!resourceName && body.name) {
                            resourceName = body.name;
                        }
                    }
                } catch (e) {
                    responseData.response = 'Non-JSON response';
                }

                const action = `${req.method}_${resource.toUpperCase()}`;
                const actionLabel = ACTION_LABELS[action] || `${req.method} ${resource}`;

                // Tìm các field đã thay đổi
                const changedFields = findChangedFields(beforeData, afterData);

                // Lấy client IP
                const clientIp = requestIp.getClientIp(req);

                // Tạo log với đầy đủ thông tin
                await ActivityLog.create({
                    user: req.user._id || req.user.id,
                    userName: req.user.name || req.user.email,
                    userEmail: req.user.email,
                    action: action,
                    actionLabel: actionLabel,
                    resource: resource,
                    resourceId: resourceId || responseData.id,
                    resourceName: resourceName,
                    beforeData: beforeData,
                    afterData: afterData,
                    changedFields: changedFields,
                    ip: clientIp,
                    userAgent: req.headers['user-agent'],
                    status: res.statusCode >= 400 ? 'failure' : 'success',
                    method: req.method,
                    path: fullPath,
                    details: {
                        ...responseData,
                        params: req.params,
                        query: req.query,
                        duration: Date.now() - startTime
                    }
                });

            } catch (err) {
                logger.error('Error saving activity log:', err);
            }
        };

        logActivity();
    };

    next();
};

export default activityLogger;
