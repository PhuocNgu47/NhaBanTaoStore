import api from './api';

export const activityLogService = {
    // Lấy danh sách logs
    getLogs: async (params) => {
        const response = await api.get('/activity-logs', { params });
        return response.data;
    }
};
