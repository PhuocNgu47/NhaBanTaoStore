import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all categories (tree structure)
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const { flat, onlyActive = 'true', onlyMenu = 'false', isFeatured } = req.query;

    // Get Featured Categories with Children (for Home Page)
    if (isFeatured === 'true') {
      const categories = await Category.find({
        isFeatured: true,
        isActive: true,
        parent: null // Only get root featured categories
      })
        .sort({ order: 1 })
        .populate({
          path: 'children',
          match: { isActive: true },
          options: { sort: { order: 1 } }
        })
        .lean();

      return res.json({
        success: true,
        categories,
      });
    }

    if (flat === 'true') {
      // Return flat list
      const query = {};
      if (onlyActive === 'true') query.isActive = true;

      const categories = await Category.find(query)
        .sort({ level: 1, order: 1, name: 1 })
        .lean();

      return res.json({
        success: true,
        categories,
        total: categories.length,
      });
    }

    // Return tree structure
    const tree = await Category.getTree({
      onlyActive: onlyActive === 'true',
      onlyMenu: onlyMenu === 'true',
    });

    res.json({
      success: true,
      categories: tree,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh mục',
      error: error.message,
    });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true })
      .populate('children')
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    // Get breadcrumb
    const breadcrumb = await Category.getBreadcrumb(category._id);

    // Get products count
    // Get products count - matching SLUGS
    const descendants = await Category.getDescendants(category._id);
    const allCategorySlugs = [category.slug, ...descendants.map(d => d.slug)];

    const productCount = await Product.countDocuments({
      $or: [
        { category: { $in: allCategorySlugs } },
        { subcategory: { $in: allCategorySlugs } },
        { productLine: { $in: allCategorySlugs } },
      ],
      status: 'active',
    });

    res.json({
      success: true,
      category: {
        ...category,
        breadcrumb,
        productCount,
      },
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh mục',
      error: error.message,
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/id/:id
// @access  Public
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id)
      .populate('children')
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh mục',
      error: error.message,
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
export const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      icon,
      parent,
      order,
      isActive,
      isFeatured,
      showInMenu,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    // Check if slug exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Slug đã tồn tại',
      });
    }

    // Validate parent level
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: 'Danh mục cha không tồn tại',
        });
      }
      if (parentCategory.level >= 2) {
        return res.status(400).json({
          success: false,
          message: 'Chỉ hỗ trợ tối đa 3 cấp danh mục',
        });
      }
    }

    const category = new Category({
      name,
      slug,
      description,
      image,
      icon,
      parent: parent || null,
      order: order || 0,
      isActive: isActive !== false,
      isFeatured: isFeatured || false,
      showInMenu: showInMenu !== false,
      metaTitle,
      metaDescription,
      metaKeywords,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo danh mục',
      error: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    // Check slug uniqueness
    if (updateData.slug && updateData.slug !== category.slug) {
      const existingCategory = await Category.findOne({ slug: updateData.slug });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Slug đã tồn tại',
        });
      }
    }

    // Validate parent
    if (updateData.parent !== undefined) {
      if (updateData.parent) {
        // Cannot set self as parent
        if (updateData.parent.toString() === id) {
          return res.status(400).json({
            success: false,
            message: 'Không thể đặt chính danh mục làm cha',
          });
        }

        const parentCategory = await Category.findById(updateData.parent);
        if (!parentCategory) {
          return res.status(400).json({
            success: false,
            message: 'Danh mục cha không tồn tại',
          });
        }
        if (parentCategory.level >= 2) {
          return res.status(400).json({
            success: false,
            message: 'Chỉ hỗ trợ tối đa 3 cấp danh mục',
          });
        }

        // Cannot move to own descendant
        const descendants = await Category.getDescendants(id);
        if (descendants.some(d => d._id.toString() === updateData.parent.toString())) {
          return res.status(400).json({
            success: false,
            message: 'Không thể di chuyển danh mục vào con cháu của nó',
          });
        }
      }
    }

    Object.assign(category, updateData);
    await category.save();

    // Update descendants' ancestors if parent changed
    if (updateData.parent !== undefined) {
      const descendants = await Category.getDescendants(id);
      for (const desc of descendants) {
        const descCategory = await Category.findById(desc._id);
        if (descCategory) {
          descCategory.parent = descCategory.parent; // Trigger recalculation
          await descCategory.save();
        }
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      category,
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật danh mục',
      error: error.message,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { force } = req.query;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    // Check for children
    const children = await Category.find({ parent: id });
    if (children.length > 0 && force !== 'true') {
      return res.status(400).json({
        success: false,
        message: `Danh mục có ${children.length} danh mục con. Sử dụng ?force=true để xóa tất cả.`,
        childrenCount: children.length,
      });
    }

    // Check for products
    const productCount = await Product.countDocuments({
      $or: [
        { category: category.slug },
        { subcategory: category.slug },
        { productLine: category.slug },
      ],
    });

    if (productCount > 0 && force !== 'true') {
      return res.status(400).json({
        success: false,
        message: `Danh mục có ${productCount} sản phẩm. Sử dụng ?force=true để xóa.`,
        productCount,
      });
    }

    // Delete children if force
    if (force === 'true' && children.length > 0) {
      for (const child of children) {
        await Category.findByIdAndDelete(child._id);
        // Recursively delete grandchildren
        const grandchildren = await Category.find({ parent: child._id });
        for (const gc of grandchildren) {
          await Category.findByIdAndDelete(gc._id);
        }
      }
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Xóa danh mục thành công',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa danh mục',
      error: error.message,
    });
  }
};

// @desc    Reorder categories
// @route   PUT /api/categories/reorder
// @access  Admin
export const reorderCategories = async (req, res) => {
  try {
    const { orders } = req.body; // [{ id, order }]

    if (!Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
      });
    }

    for (const item of orders) {
      await Category.findByIdAndUpdate(item.id, { order: item.order });
    }

    res.json({
      success: true,
      message: 'Sắp xếp danh mục thành công',
    });
  } catch (error) {
    console.error('Reorder categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi sắp xếp danh mục',
      error: error.message,
    });
  }
};

// @desc    Get menu categories (for sidebar)
// @route   GET /api/categories/menu
// @access  Public
export const getMenuCategories = async (req, res) => {
  try {
    const tree = await Category.getTree({
      onlyActive: true,
      onlyMenu: true,
    });

    res.json({
      success: true,
      menu: tree,
    });
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy menu',
      error: error.message,
    });
  }
};

// @desc    Sync all categories productCount
// @route   POST /api/categories/sync-counts
// @access  Admin
export const syncProductCounts = async (req, res) => {
  try {
    // Get all root level categories
    const rootCategories = await Category.find({ level: 0 });

    let updatedCount = 0;

    // Update each root category (this will recursively update children via ancestors)
    for (const category of rootCategories) {
      await Category.updateProductCount(category._id);
      updatedCount++;

      // Also update children
      const descendants = await Category.getDescendants(category._id);
      for (const desc of descendants) {
        await Category.updateProductCount(desc._id);
        updatedCount++;
      }
    }

    res.json({
      success: true,
      message: `Đã đồng bộ số lượng sản phẩm cho ${updatedCount} danh mục`,
      updatedCount,
    });
  } catch (error) {
    console.error('Sync product counts error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đồng bộ số lượng sản phẩm',
      error: error.message,
    });
  }
};

