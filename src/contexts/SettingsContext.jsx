import { createContext, useState, useEffect, useContext } from 'react';
import settingsService from '../services/settingsService';

const SettingsContext = createContext();

export const useSettings = () => {
    return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        siteName: 'Nhà Bán Táo Store',
        email: 'info@anhphibantao.com',
        phone: '0123 456 789',
        address: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
        hotline: '1800 1234',
        facebook: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        zalo: '',
        loading: true // Add loading inside settings object for convenience or separate state
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await settingsService.getPublicSettings();
                if (response.success && response.settings) {
                    setSettings(prev => ({
                        ...prev,
                        ...response.settings
                    }));
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const value = {
        settings, // This contains all fields + loading potentially
        loading
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
