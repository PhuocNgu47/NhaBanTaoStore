/**
 * Ví Dụ: Phát Triển Quan Hệ Mới Từ Đầu Đến Cuối
 * 
 * Scenario: Thêm quan hệ Product → Category (N:1)
 * 
 * Quy trình:
 * 1. Phân tích yêu cầu
 * 2. Thiết kế schema
 * 3. Implement model
 * 4. Update routes với populate
 * 5. Seed data
 * 6. Test queries
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// BƯỚC 1: PHÂN TÍCH YÊU CẦU
// ============================================

/**
 * Yêu cầu:
 * - Products cần có Category
 * - Một Category có nhiều Products
 * - Quan hệ: Product (N) → Category (1)
 * - Cần query: "Lấy tất cả products của category X"
 * - Cần query: "Lấy category của product Y"
 */

// ============================================
// BƯỚC 2: THIẾT KẾ SCHEMA
// ============================================

/**
 * Category Schema:
 * - name: String (required, unique)
 * - slug: String (unique, SEO-friendly)
 * - description: String
 * - image: String
 * - parentCategory: ObjectId (self-reference cho subcategories)
 * 
 * Product Schema (update):
 * - category: ObjectId (ref: Category) - thay vì String
 */

// ============================================
// BƯỚC 3: IMPLEMENT MODEL
// ============================================

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: String,
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',  // Self-reference
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ isActive: 1 });

// Virtual để lấy products của category
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// Method để generate slug từ name
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

// ============================================
// BƯỚC 4: UPDATE PRODUCT MODEL
// ============================================

// Giả sử Product model đã tồn tại, chỉ cần update field category
// Trong thực tế, bạn sẽ update file backend/models/Product.js

const productSchemaUpdate = {
  // ... existing fields
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',  // ← Thay đổi từ String thành ObjectId reference
    required: true
  }
  // ... rest of schema
};

// Thêm index
// productSchema.index({ category: 1 });

// ============================================
// BƯỚC 5: SEED DATA
// ============================================

async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...\n');

    const categories = [
      {
        name: 'iPhone',
        slug: 'iphone',
        description: 'Apple iPhone smartphones'
      },
      {
        name: 'iPad',
        slug: 'ipad',
        description: 'Apple iPad tablets'
      },
      {
        name: 'MacBook',
        slug: 'macbook',
        description: 'Apple MacBook laptops'
      },
      {
        name: 'Apple Watch',
        slug: 'apple-watch',
        description: 'Apple Watch smartwatches'
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Apple accessories and peripherals'
      }
    ];

    // Xóa categories cũ (nếu có)
    await Category.deleteMany({});

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories\n`);

    // Hiển thị categories
    createdCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.slug})`);
    });

    return createdCategories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

// ============================================
// BƯỚC 6: TEST QUERIES
// ============================================

async function testQueries() {
  try {
    console.log('\n📊 Testing queries...\n');

    // Query 1: Lấy tất cả categories
    console.log('1️⃣  Get all categories:');
    const allCategories = await Category.find({ isActive: true })
      .sort({ name: 1 });
    console.log(`   Found ${allCategories.length} categories\n`);

    // Query 2: Lấy category với products (populate)
    console.log('2️⃣  Get category with products:');
    const category = await Category.findOne({ slug: 'iphone' })
      .populate('products', 'name price image');  // Populate products
    
    if (category) {
      console.log(`   Category: ${category.name}`);
      console.log(`   Products: ${category.products?.length || 0}\n`);
    }

    // Query 3: Lấy products của một category
    // (Giả sử Product model đã được update)
    console.log('3️⃣  Get products by category:');
    // const products = await Product.find({ category: category._id })
    //   .populate('category', 'name slug');
    // console.log(`   Found ${products.length} products\n`);

    // Query 4: Lấy category của một product
    console.log('4️⃣  Get category of a product:');
    // const product = await Product.findById(productId)
    //   .populate('category', 'name slug description');
    // console.log(`   Product: ${product.name}`);
    // console.log(`   Category: ${product.category.name}\n`);

    // Query 5: Aggregation - Đếm products theo category
    console.log('5️⃣  Count products by category (aggregation):');
    // const stats = await Product.aggregate([
    //   { $group: { _id: '$category', count: { $sum: 1 } } },
    //   { $lookup: {
    //     from: 'categories',
    //     localField: '_id',
    //     foreignField: '_id',
    //     as: 'category'
    //   }},
    //   { $unwind: '$category' },
    //   { $project: { categoryName: '$category.name', count: 1 } }
    // ]);
    // stats.forEach(stat => {
    //   console.log(`   ${stat.categoryName}: ${stat.count} products`);
    // });

  } catch (error) {
    console.error('❌ Error testing queries:', error);
  }
}

// ============================================
// BƯỚC 7: MIGRATION SCRIPT (Nếu cần)
// ============================================

/**
 * Nếu đã có products với category là String,
 * cần migration để convert sang ObjectId
 */
async function migrateProductCategories() {
  try {
    console.log('\n🔄 Migrating product categories...\n');

    // Lấy Product model (giả sử đã import)
    // const Product = mongoose.model('Product');

    // Lấy tất cả products với category là String
    // const products = await Product.find({ 
    //   category: { $type: 'string' } 
    // });

    // for (const product of products) {
    //   // Tìm category theo name
    //   const category = await Category.findOne({ 
    //     name: product.category 
    //   });

    //   if (category) {
    //     // Update product với category ObjectId
    //     await Product.updateOne(
    //       { _id: product._id },
    //       { $set: { category: category._id } }
    //     );
    //     console.log(`✅ Migrated: ${product.name}`);
    // } else {
    //     console.log(`⚠️  Category not found: ${product.category}`);
    //   }
    // }

    console.log('✅ Migration completed\n');
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
  try {
    console.log('🚀 PHÁT TRIỂN QUAN HỆ MỚI: Product → Category\n');
    console.log('═══════════════════════════════════════\n');

    // Kết nối MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Seed categories
    const categories = await seedCategories();

    // Test queries
    await testQueries();

    // Migration (nếu cần)
    // await migrateProductCategories();

    console.log('═══════════════════════════════════════');
    console.log('✅ HOÀN THÀNH');
    console.log('═══════════════════════════════════════\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Chạy nếu được gọi trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { Category, seedCategories, testQueries };

