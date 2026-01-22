import { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronRight,
  FiChevronDown,
  FiLoader,
  FiSearch,
  FiX,
  FiMove,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { categoryService } from '../../services/categoryService';
import { toast } from 'react-toastify';

const LEVEL_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create | edit
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    image: '',
    parent: '',
    order: 0,
    isActive: true,
    isFeatured: false,
    showInMenu: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const [treeResponse, flatResponse] = await Promise.all([
        categoryService.getCategories({ onlyActive: 'false' }),
        categoryService.getCategoriesFlat({ onlyActive: 'false' }),
      ]);
      
      if (treeResponse.success) {
        setCategories(treeResponse.categories || []);
        // Expand all by default
        const expanded = {};
        const expandAll = (cats) => {
          cats.forEach(cat => {
            expanded[cat._id] = true;
            if (cat.children) expandAll(cat.children);
          });
        };
        expandAll(treeResponse.categories || []);
        setExpandedCategories(expanded);
      }
      
      if (flatResponse.success) {
        setFlatCategories(flatResponse.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Lỗi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: modalMode === 'create' ? generateSlug(name) : prev.slug,
    }));
  };

  const openCreateModal = (parentId = null) => {
    setModalMode('create');
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '',
      image: '',
      parent: parentId || '',
      order: 0,
      isActive: true,
      isFeatured: false,
      showInMenu: true,
    });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      image: category.image || '',
      parent: category.parent || '',
      order: category.order || 0,
      isActive: category.isActive,
      isFeatured: category.isFeatured,
      showInMenu: category.showInMenu,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Tên danh mục là bắt buộc');
      return;
    }
    
    try {
      setSaving(true);
      
      const data = {
        ...formData,
        parent: formData.parent || null,
      };
      
      let response;
      if (modalMode === 'create') {
        response = await categoryService.createCategory(data);
        toast.success('Tạo danh mục thành công');
      } else {
        response = await categoryService.updateCategory(editingCategory._id, data);
        toast.success('Cập nhật danh mục thành công');
      }
      
      if (response.success) {
        setShowModal(false);
        fetchCategories();
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Lỗi lưu danh mục');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const hasChildren = category.children && category.children.length > 0;
    
    const message = hasChildren
      ? `Danh mục "${category.name}" có ${category.children.length} danh mục con. Bạn có chắc muốn xóa tất cả?`
      : `Bạn có chắc muốn xóa danh mục "${category.name}"?`;
    
    if (!window.confirm(message)) return;
    
    try {
      const response = await categoryService.deleteCategory(category._id, hasChildren);
      if (response.success) {
        toast.success('Xóa danh mục thành công');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Lỗi xóa danh mục');
    }
  };

  const toggleActive = async (category) => {
    try {
      await categoryService.updateCategory(category._id, {
        isActive: !category.isActive,
      });
      toast.success(category.isActive ? 'Đã ẩn danh mục' : 'Đã hiện danh mục');
      fetchCategories();
    } catch (error) {
      toast.error('Lỗi cập nhật');
    }
  };

  // Filter categories by search
  const filterCategories = (cats, query) => {
    if (!query) return cats;
    
    return cats.filter(cat => {
      const matchSelf = cat.name.toLowerCase().includes(query.toLowerCase());
      const matchChildren = cat.children && filterCategories(cat.children, query).length > 0;
      return matchSelf || matchChildren;
    }).map(cat => ({
      ...cat,
      children: cat.children ? filterCategories(cat.children, query) : [],
    }));
  };

  const filteredCategories = filterCategories(categories, searchQuery);

  // Get valid parents for select (exclude self and descendants)
  const getValidParents = () => {
    if (modalMode === 'create') {
      return flatCategories.filter(c => c.level < 2);
    }
    
    // For edit, exclude self and descendants
    const excludeIds = new Set([editingCategory?._id]);
    const addDescendants = (cats) => {
      cats.forEach(cat => {
        if (cat.ancestors?.some(a => a._id === editingCategory?._id)) {
          excludeIds.add(cat._id);
        }
      });
    };
    addDescendants(flatCategories);
    
    return flatCategories.filter(c => !excludeIds.has(c._id) && c.level < 2);
  };

  const renderCategory = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories[category._id];
    const paddingLeft = 16 + level * 24;

    return (
      <div key={category._id} className="category-row">
        <div
          className={`
            flex items-center gap-3 py-3 px-4 border-b hover:bg-gray-50 transition-colors
            ${!category.isActive ? 'opacity-50' : ''}
          `}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => toggleExpand(category._id)}
            className={`w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 ${!hasChildren ? 'invisible' : ''}`}
          >
            {isExpanded ? (
              <FiChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <FiChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {/* Level Badge */}
          <span className={`px-2 py-0.5 text-xs rounded ${LEVEL_COLORS[category.level]}`}>
            L{category.level}
          </span>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800 truncate">{category.name}</span>
              {category.isFeatured && (
                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                  Nổi bật
                </span>
              )}
              {!category.showInMenu && (
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                  Ẩn menu
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">{category.slug}</div>
          </div>

          {/* Product Count */}
          <span className="text-sm text-gray-500 w-20 text-center">
            {category.productCount || 0} SP
          </span>

          {/* Order */}
          <span className="text-sm text-gray-500 w-12 text-center">
            #{category.order}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Add Child (only for level 0, 1) */}
            {category.level < 2 && (
              <button
                onClick={() => openCreateModal(category._id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded"
                title="Thêm danh mục con"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            )}
            
            {/* Toggle Active */}
            <button
              onClick={() => toggleActive(category)}
              className={`p-2 rounded ${category.isActive ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
              title={category.isActive ? 'Ẩn danh mục' : 'Hiện danh mục'}
            >
              {category.isActive ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
            </button>
            
            {/* Edit */}
            <button
              onClick={() => openEditModal(category)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              title="Sửa"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            
            {/* Delete */}
            <button
              onClick={() => handleDelete(category)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
              title="Xóa"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="children">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
          <p className="text-gray-600">Hệ thống danh mục 3 cấp</p>
        </div>
        <button
          onClick={() => openCreateModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="w-5 h-5" />
          Thêm danh mục gốc
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Tree */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 border-b font-medium text-sm text-gray-600">
          <div className="w-6" /> {/* Expand */}
          <div className="w-10">Cấp</div>
          <div className="flex-1">Tên danh mục</div>
          <div className="w-20 text-center">Sản phẩm</div>
          <div className="w-12 text-center">STT</div>
          <div className="w-36 text-center">Thao tác</div>
        </div>

        {/* Categories List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? 'Không tìm thấy danh mục' : 'Chưa có danh mục nào'}
          </div>
        ) : (
          <div className="categories-tree">
            {filteredCategories.map(category => renderCategory(category))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 flex gap-4 text-sm text-gray-600">
        <span>Tổng: {flatCategories.length} danh mục</span>
        <span>•</span>
        <span>Level 0: {flatCategories.filter(c => c.level === 0).length}</span>
        <span>•</span>
        <span>Level 1: {flatCategories.filter(c => c.level === 1).length}</span>
        <span>•</span>
        <span>Level 2: {flatCategories.filter(c => c.level === 2).length}</span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">
                {modalMode === 'create' ? 'Thêm danh mục mới' : 'Sửa danh mục'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: iPhone 16 Series"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="iphone-16-series"
                />
              </div>

              {/* Parent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục cha
                </label>
                <select
                  value={formData.parent}
                  onChange={(e) => setFormData(prev => ({ ...prev, parent: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— Danh mục gốc —</option>
                  {getValidParents().map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {'—'.repeat(cat.level + 1)} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả ngắn về danh mục"
                />
              </div>

              {/* Icon & Image */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (tên icon)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="FiSmartphone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thứ tự
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Kích hoạt</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showInMenu}
                    onChange={(e) => setFormData(prev => ({ ...prev, showInMenu: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Hiện trong menu</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Nổi bật</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <FiLoader className="w-4 h-4 animate-spin" />}
                  {modalMode === 'create' ? 'Tạo danh mục' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
