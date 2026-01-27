import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên danh mục là bắt buộc'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // unique: true tự động tạo index
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    icon: {
      type: String, // Icon class name (e.g., 'FiSmartphone', 'FiTablet')
      default: '',
    },
    
    // Hierarchy - 3 levels
    // Level 0: Root category (parent = null)
    // Level 1: Subcategory (parent = root category)
    // Level 2: Product line (parent = subcategory)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    level: {
      type: Number,
      default: 0, // 0 = root, 1 = subcategory, 2 = product line
      min: 0,
      max: 2,
    },
    ancestors: [{
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      name: String,
      slug: String,
      level: Number,
    }],
    
    // Display settings
    order: {
      type: Number,
      default: 0, // Sort order within same level
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false, // Show on homepage
    },
    showInMenu: {
      type: Boolean,
      default: true, // Show in sidebar menu
    },
    
    // SEO
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    
    // Stats (auto-calculated)
    productCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: get children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  options: { sort: { order: 1 } },
});

// Indexes
// Lưu ý: slug đã có unique: true nên không cần index riêng
categorySchema.index({ parent: 1, order: 1 });
categorySchema.index({ level: 1, isActive: 1 });
categorySchema.index({ isActive: 1, showInMenu: 1 });

// Pre-save: auto calculate level and ancestors
categorySchema.pre('save', async function (next) {
  if (this.isModified('parent')) {
    if (!this.parent) {
      this.level = 0;
      this.ancestors = [];
    } else {
      const parentCategory = await this.constructor.findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;
        this.ancestors = [
          ...parentCategory.ancestors,
          {
            _id: parentCategory._id,
            name: parentCategory.name,
            slug: parentCategory.slug,
            level: parentCategory.level,
          },
        ];
      }
    }
  }
  next();
});

// Static: get category tree
categorySchema.statics.getTree = async function (options = {}) {
  const { onlyActive = true, onlyMenu = false } = options;
  
  const query = {};
  if (onlyActive) query.isActive = true;
  if (onlyMenu) query.showInMenu = true;
  
  const categories = await this.find(query)
    .sort({ level: 1, order: 1, name: 1 })
    .lean();
  
  // Build tree structure
  const buildTree = (items, parentId = null) => {
    return items
      .filter(item => {
        const itemParent = item.parent ? item.parent.toString() : null;
        const compareParent = parentId ? parentId.toString() : null;
        return itemParent === compareParent;
      })
      .map(item => ({
        ...item,
        children: buildTree(items, item._id),
      }));
  };
  
  return buildTree(categories);
};

// Static: get breadcrumb
categorySchema.statics.getBreadcrumb = async function (categoryId) {
  const category = await this.findById(categoryId).lean();
  if (!category) return [];
  
  return [
    ...category.ancestors,
    { _id: category._id, name: category.name, slug: category.slug, level: category.level },
  ];
};

// Static: get all descendants
categorySchema.statics.getDescendants = async function (categoryId) {
  const category = await this.findById(categoryId);
  if (!category) return [];
  
  const descendants = await this.find({
    'ancestors._id': categoryId,
  }).lean();
  
  return descendants;
};

// Static: update product count
categorySchema.statics.updateProductCount = async function (categoryId) {
  const Product = mongoose.model('Product');
  
  // Get this category and all descendants
  const category = await this.findById(categoryId);
  if (!category) return;
  
  const descendantIds = (await this.getDescendants(categoryId)).map(d => d._id);
  const allCategoryIds = [categoryId, ...descendantIds];
  
  // Count products in this category and descendants
  const count = await Product.countDocuments({
    category: { $in: allCategoryIds.map(id => id.toString()) },
    status: 'active',
  });
  
  await this.findByIdAndUpdate(categoryId, { productCount: count });
  
  // Update parent counts
  for (const ancestor of category.ancestors) {
    await this.updateProductCount(ancestor._id);
  }
};

const Category = mongoose.model('Category', categorySchema);

export default Category;
