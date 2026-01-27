import api from './api';

export const settingsService = {
    // Lấy cài đặt công khai
    getPublicSettings: async () => {
        const response = await api.get('/settings');
        return response.data;
    },

    // Lấy toàn bộ cài đặt (Admin)
    getAdminSettings: async () => {
        const response = await api.get('/settings/admin');
        return response.data;
    },

    // Cập nhật toàn bộ cài đặt
    updateSettings: async (settings) => {
        const response = await api.put('/settings', settings);
        return response.data;
    },

    // Cập nhật theo section
    updateSection: async (section, data) => {
        const response = await api.patch(`/settings/${section}`, data);
        return response.data;
    },
};

export default settingsService;
