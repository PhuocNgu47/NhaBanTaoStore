import express from 'express';
import Setting from '../models/Setting.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public (một số thông tin công khai như tên, liên hệ)
router.get('/', async (req, res) => {
    try {
        const settings = await Setting.getSettings();

        // Trả về thông tin công khai
        res.json({
            success: true,
            settings: {
                siteName: settings.siteName,
                siteDescription: settings.siteDescription,
                logo: settings.logo,
                email: settings.email,
                phone: settings.phone,
                hotline: settings.hotline,
                address: settings.address,
                facebook: settings.facebook,
                instagram: settings.instagram,
                youtube: settings.youtube,
                tiktok: settings.tiktok,
                zalo: settings.zalo,
                freeShipThreshold: settings.freeShipThreshold,
                defaultShippingFee: settings.defaultShippingFee,
                paymentMethods: settings.paymentMethods,
            },
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tải cài đặt',
        });
    }
});

// @desc    Get all settings (Admin)
// @route   GET /api/settings/admin
// @access  Private/Admin
router.get('/admin', protect, admin, async (req, res) => {
    try {
        const settings = await Setting.getSettings();
        res.json({
            success: true,
            settings,
        });
    } catch (error) {
        console.error('Error fetching admin settings:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tải cài đặt',
        });
    }
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
    try {
        let settings = await Setting.findOne();

        if (!settings) {
            settings = new Setting(req.body);
        } else {
            // Cập nhật từng field
            const allowedFields = [
                'siteName',
                'siteDescription',
                'logo',
                'favicon',
                'email',
                'phone',
                'hotline',
                'address',
                'facebook',
                'instagram',
                'youtube',
                'tiktok',
                'zalo',
                'freeShipThreshold',
                'defaultShippingFee',
                'paymentMethods',
                'bankInfo',
                'seo',
                'maintenanceMode',
                'currency',
            ];

            allowedFields.forEach((field) => {
                if (req.body[field] !== undefined) {
                    settings[field] = req.body[field];
                }
            });
        }

        await settings.save();

        res.json({
            success: true,
            message: 'Cập nhật cài đặt thành công',
            settings,
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật cài đặt',
        });
    }
});

// @desc    Update specific section of settings
// @route   PATCH /api/settings/:section
// @access  Private/Admin
router.patch('/:section', protect, admin, async (req, res) => {
    try {
        const { section } = req.params;
        let settings = await Setting.getSettings();

        const validSections = [
            'general',
            'contact',
            'social',
            'shipping',
            'payment',
            'bank',
            'seo',
        ];

        if (!validSections.includes(section)) {
            return res.status(400).json({
                success: false,
                message: 'Section không hợp lệ',
            });
        }

        // Map section to fields
        const sectionFieldsMap = {
            general: ['siteName', 'siteDescription', 'logo', 'favicon', 'maintenanceMode'],
            contact: ['email', 'phone', 'hotline', 'address'],
            social: ['facebook', 'instagram', 'youtube', 'tiktok', 'zalo'],
            shipping: ['freeShipThreshold', 'defaultShippingFee'],
            payment: ['paymentMethods'],
            bank: ['bankInfo'],
            seo: ['seo'],
        };

        const allowedFields = sectionFieldsMap[section];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                settings[field] = req.body[field];
            }
        });

        await settings.save();

        res.json({
            success: true,
            message: `Cập nhật ${section} thành công`,
            settings,
        });
    } catch (error) {
        console.error('Error updating settings section:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật cài đặt',
        });
    }
});

export default router;
