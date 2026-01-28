import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();

const seedProduct = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const productData = {
            name: 'Apple Watch Ultra 3 LTE 49mm Vỏ Titan Tự Nhiên - Dây đeo cao su Ocean - Chính Hãng VN/A',
            slug: 'apple-watch-ultra-3-lte-49mm-titan-ocean',
            category: 'apple-watch',
            brand: 'Apple',
            description: `
                <h3>Apple Watch Ultra 3: Đồng Hồ Thông Minh Cao Cấp Cho Người Yêu Thể Thao Và Phiêu Lưu</h3>
                <p>Apple Watch Ultra 3 là chiếc đồng hồ thông minh cao cấp mới nhất từ Apple, được thiết kế dành riêng cho những ai đam mê thể thao, phiêu lưu và lối sống năng động. Với vỏ titanium tự nhiên hoặc đen, màn hình Retina Luôn Bật sáng đến 3000 nit, và thời lượng pin ấn tượng lên đến 42 giờ, đây là người bạn đồng hành lý tưởng cho mọi hành trình. Hãy khám phá lý do tại sao bạn nên sở hữu Apple Watch Ultra 3 chính hãng tại Nhà Táo ngay hôm nay!</p>
                <div class="product-description-images">
                    <img src="https://nhataostore.com/Content/Images/Images/20251023001402.png" alt="Apple Watch Ultra 3 Feature 1" />
                    <img src="https://nhataostore.com/Content/Images/Images/20251023001601.png" alt="Apple Watch Ultra 3 Feature 2" />
                    <img src="https://nhataostore.com/Content/Images/Images/20251023001803.png" alt="Apple Watch Ultra 3 Feature 3" />
                </div>
            `.trim(),
            shortDescription: 'Siêu phẩm đồng hồ thể thao titanium cao cấp nhất 2024 từ Apple.',
            price: 23100000,
            originalPrice: 23520000,
            image: 'https://nhataostore.com/Content/Images/SanPham/apple-watch-ultra-3-lte-49mm-vo-titan-tu-nhien-day-deo-cao-su-ocean-chinh-hang-vna-den.png?v%2023/10/2025%2012:38:01%20SA',
            images: [
                'https://nhataostore.com/Content/Images/SanPham/apple-watch-ultra-3-lte-49mm-vo-titan-tu-nhien-day-deo-cao-su-ocean-chinh-hang-vna-den.png?v%2023/10/2025%2012:38:01%20SA',
                'https://nhataostore.com/Content/Images/SanPham/apple-watch-ultra-3-lte-49mm-vo-titan-tu-nhien-day-deo-cao-su-ocean-chinh-hang-vna-xanh-da-quang.png?v%2023/10/2025%2012:38:01%20SA',
                'https://nhataostore.com/Content/Images/SanPham/apple-watch-ultra-3-lte-49mm-vo-titan-tu-nhien-day-deo-cao-su-ocean-chinh-hang-vna-xanh-mo-neo.png?v%2023/10/2025%2012:38:01%20SA'
            ],
            stock: 20,
            featured: true,
            status: 'active',
            specifications: {
                'Kích thước': '49mm',
                'Chất liệu': 'Titanium Grade 5',
                'Màn hình': 'Retina Always-on 3000 nits',
                'Kết nối': 'LTE + GPS',
                'Màu sắc': 'Titan Tự Nhiên',
                'Dây đeo': 'Ocean Band'
            },
            warranty: '12 tháng chính hãng Apple VN/A',
            variants: [
                {
                    sku: 'AW-ULTRA3-TITAN-OCEAN-DEN',
                    name: 'Đen',
                    type: 'nguyen-seal',
                    attributes: { color: 'Đen' },
                    price: 23100000,
                    originalPrice: 23520000,
                    stock: 10,
                    isActive: true,
                    isFeatured: true,
                    image: 'https://nhataostore.com/Content/Images/SanPham/apple-watch-ultra-3-lte-49mm-vo-titan-tu-nhien-day-deo-cao-su-ocean-chinh-hang-vna-den.png?v%2023/10/2025%2012:38:01%20SA'
                },
                {
                    sku: 'AW-ULTRA3-TITAN-OCEAN-XANH-DQ',
                    name: 'Xanh Dạ Quang',
                    type: 'nguyen-seal',
                    attributes: { color: 'Xanh Dạ Quang' },
                    price: 23100000,
                    originalPrice: 23520000,
                    stock: 5,
                    isActive: true,
                    image: 'https://nhataostore.com/Content/Images/SanPham/apple-watch-ultra-3-lte-49mm-vo-titan-tu-nhien-day-deo-cao-su-ocean-chinh-hang-vna-xanh-da-quang.png?v%2023/10/2025%2012:38:01%20SA'
                },
                {
                    sku: 'AW-ULTRA3-TITAN-OCEAN-XANH-MN',
                    name: 'Xanh Mơ Neo',
                    type: 'nguyen-seal',
                    attributes: { color: 'Xanh Mơ Neo' },
                    price: 23100000,
                    originalPrice: 23520000,
                    stock: 5,
                    isActive: true,
                    image: 'https://nhataostore.com/Content/Images/SanPham/apple-watch-ultra-3-lte-49mm-vo-titan-tu-nhien-day-deo-cao-su-ocean-chinh-hang-vna-xanh-mo-neo.png?v%2023/10/2025%2012:38:01%20SA'
                }
            ]
        };

        // Check if exists
        const existing = await Product.findOne({ slug: productData.slug });
        if (existing) {
            console.log('Product already exists, updating...');
            Object.assign(existing, productData);
            await existing.save();
            console.log('Updated successfully');
        } else {
            await Product.create(productData);
            console.log('Created successfully');
        }

        // Update category count
        const category = await Category.findOne({ slug: productData.category });
        if (category) {
            await Category.updateProductCount(category._id);
            console.log('Updated category product count');
        }

        await mongoose.disconnect();
        console.log('Disconnected');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedProduct();
