import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
    {
        // Thông tin cơ bản website
        siteName: {
            type: String,
            default: 'Nhà Bán Táo Store',
        },
        siteDescription: {
            type: String,
            default: 'Cửa hàng Apple uy tín',
        },
        logo: {
            type: String,
            default: '',
        },
        favicon: {
            type: String,
            default: '',
        },

        // Thông tin liên hệ
        email: {
            type: String,
            default: 'info@nhabantao.com',
        },
        phone: {
            type: String,
            default: '0123 456 789',
        },
        hotline: {
            type: String,
            default: '1800 1234',
        },
        address: {
            type: String,
            default: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
        },

        // Social media
        facebook: {
            type: String,
            default: '',
        },
        instagram: {
            type: String,
            default: '',
        },
        youtube: {
            type: String,
            default: '',
        },
        tiktok: {
            type: String,
            default: '',
        },
        zalo: {
            type: String,
            default: '',
        },

        // Cài đặt vận chuyển
        freeShipThreshold: {
            type: Number,
            default: 300000,
        },
        defaultShippingFee: {
            type: Number,
            default: 30000,
        },

        // Cài đặt thanh toán (Toggle & Config)
        payment: {
            cod: { type: Boolean, default: true },
            bankTransfer: { type: Boolean, default: true },
            momo: {
                enabled: { type: Boolean, default: false },
                phoneNumber: String,
                accountHolder: String,
                qrCode: String
            },
            vnpay: { type: Boolean, default: false }, // Simulation mode only for now
            zalopay: { type: Boolean, default: false }
        },

        // Danh sách tài khoản ngân hàng
        banks: [{
            bin: String, // Mã BIN ngân hàng (ví dụ: 970436)
            shortName: String, // Tên viết tắt (ví dụ: VCB)
            logo: String, // Logo ngân hàng
            bankName: String, // Tên đầy đủ
            bankNumber: String, // Số tài khoản
            bankHolder: String, // Chủ tài khoản
            isDefault: { type: Boolean, default: false }
        }],

        // Cài đặt SEO
        seo: {
            metaTitle: { type: String, default: '' },
            metaDescription: { type: String, default: '' },
            metaKeywords: { type: String, default: '' },
        },

        // Cài đặt khác
        maintenanceMode: {
            type: Boolean,
            default: false,
        },
        currency: {
            type: String,
            default: 'VND',
        },
    },
    {
        timestamps: true,
    }
);

// Đảm bảo chỉ có 1 document settings
settingSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

export default mongoose.model('Setting', settingSchema);
