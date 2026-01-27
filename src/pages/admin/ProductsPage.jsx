import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiImage, FiLoader } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';
import { productService } from '../../services/productService';
import { CATEGORIES } from '../../constants';
import { toast } from 'react-toastify';
import VariantManager from '../../components/admin/VariantManager';
import Modal, { ConfirmModal } from '../../components/Modal';

// Initial form state
const initialFormState = {
  name: '',
  sku: '',
  category: '',
  price: '',
  originalPrice: '',
  stock: '',
  description: '',
  image: '',
  images: [],
  brand: 'Apple',
  warranty: '12 tháng',
  featured: false,
  status: 'active',
  specifications: {},
  variants: [], // NEW: Array of product variants
};

const AdminProductsPage = () => {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [imageInput, setImageInput] = useState('');

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchQuery && { search: searchQuery }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(statusFilter && { status: statusFilter }),
      };

      const response = await productService.getProducts(params);

      if (response.success) {
        setProducts(response.products || []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 1,
        }));
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Open modal for add/edit
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        stock: product.stock || 0,
        description: product.description || '',
        image: product.image || '',
        images: product.images || [],
        brand: product.brand || 'Apple',
        warranty: product.warranty || '12 tháng',
        featured: product.featured || false,
        status: product.status || 'active',
        specifications: product.specifications || {},
        variants: product.variants || [],
      });
    } else {
      setEditingProduct(null);
      setFormData(initialFormState);
    }
    setImageInput('');
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(initialFormState);
    setImageInput('');
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Add image URL
  const addImageUrl = () => {
    if (imageInput.trim()) {
      if (!formData.image) {
        setFormData(prev => ({ ...prev, image: imageInput.trim() }));
      } else {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageInput.trim()],
        }));
      }
      setImageInput('');
    }
  };

  // Remove image
  const removeImage = (index) => {
    if (index === -1) {
      // Remove main image
      setFormData(prev => ({
        ...prev,
        image: prev.images[0] || '',
        images: prev.images.slice(1),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  // Submit form (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }
    if (!formData.category) {
      toast.error('Vui lòng chọn danh mục');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Vui lòng nhập giá hợp lệ');
      return;
    }

    try {
      setSubmitting(true);

      // Calculate stock from variants if has variants
      let calculatedStock = Number(formData.stock) || 0;
      if (formData.variants && formData.variants.length > 0) {
        calculatedStock = formData.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      }

      const productData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: calculatedStock,
        variants: formData.variants || [],
      };

      if (editingProduct) {
        // Update
        const response = await productService.updateProduct(editingProduct._id, productData);
        if (response.success) {
          toast.success('Cập nhật sản phẩm thành công!');
          closeModal();
          fetchProducts();
        }
      } else {
        // Create
        const response = await productService.createProduct(productData);
        if (response.success) {
          toast.success('Thêm sản phẩm thành công!');
          closeModal();
          fetchProducts();
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  // Open delete confirmation
  const openDeleteModal = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      setSubmitting(true);
      const response = await productService.deleteProduct(deletingProduct._id);

      if (response.success) {
        toast.success('Xóa sản phẩm thành công!');
        setShowDeleteModal(false);
        setDeletingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

  // Render status badge
  const renderStatus = (status, stock) => {
    if (stock === 0) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">Hết hàng</span>;
    }

    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-600', label: 'Đang bán' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Ngừng bán' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-600', label: 'Nháp' },
    };

    const config = statusConfig[status] || statusConfig.active;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>;
  };

  // Get category name
  const getCategoryName = (categoryId) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus />
          Thêm sản phẩm
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
            <option value="draft">Nháp</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="animate-spin text-blue-600 mr-2" size={24} />
            <span className="text-gray-500">Đang tải...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có sản phẩm nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-sm text-gray-500">
                    <th className="p-4">Hình ảnh</th>
                    <th className="p-4">Tên sản phẩm</th>
                    <th className="p-4">Danh mục</th>
                    <th className="p-4">Giá</th>
                    <th className="p-4">Tồn kho</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = '/placeholder.png'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FiImage size={24} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{getCategoryName(product.category)}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-blue-600">{formatPrice(product.price)}</p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <p className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        {renderStatus(product.status, product.stock)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal(product)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Sửa"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Hiển thị {products.length} / {pagination.total} sản phẩm
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {[...Array(Math.min(pagination.pages, 5))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                    className={`px-3 py-1 rounded ${pagination.page === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.pages}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={closeModal}
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        subtitle={editingProduct ? `Cập nhật thông tin cho ${editingProduct.name}` : 'Điền thông tin sản phẩm mới'}
        size="full"
        footer={
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium"
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {submitting && <FiLoader className="animate-spin" />}
              {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
            </button>
          </div>
        }
      >

        <form id="product-form" onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: iPad Pro 11 inch M4 2024"
              />
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn danh mục</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Apple"
                />
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá bán <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá gốc (trước giảm)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Stock & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tồn kho
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngừng bán</option>
                  <option value="draft">Nháp</option>
                </select>
              </div>
            </div>

            {/* Warranty & Featured */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bảo hành
                </label>
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12 tháng"
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Sản phẩm nổi bật</span>
                </label>
              </div>
            </div>

            {/* Variant Manager */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biến thể sản phẩm
              </label>
              <VariantManager
                variants={formData.variants || []}
                onChange={(variants) => setFormData(prev => ({ ...prev, variants }))}
                basePrice={Number(formData.price) || 0}
                baseSku={formData.sku || formData.name?.slice(0, 10).toUpperCase().replace(/\s+/g, '-') || 'SKU'}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Nhập mô tả sản phẩm..."
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập URL hình ảnh..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Thêm
                </button>
              </div>

              {/* Image previews */}
              <div className="flex flex-wrap gap-3">
                {formData.image && (
                  <div className="relative group">
                    <img
                      src={formData.image}
                      alt="Main"
                      className="w-24 h-24 object-cover rounded-lg border-2 border-blue-500"
                      onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                    <span className="absolute top-1 left-1 text-xs bg-blue-500 text-white px-1 rounded">Chính</span>
                    <button
                      type="button"
                      onClick={() => removeImage(-1)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                )}
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border"
                      onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
                {!formData.image && formData.images.length === 0 && (
                  <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400">
                    <FiImage size={24} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={showDeleteModal && !!deletingProduct}
        onClose={() => { setShowDeleteModal(false); setDeletingProduct(null); }}
        onConfirm={handleDelete}
        title="Xác nhận xóa sản phẩm"
        message={
          deletingProduct
            ? `Bạn có chắc chắn muốn xóa sản phẩm "${deletingProduct.name}"? Hành động này không thể hoàn tác.`
            : ''
        }
        type="danger"
        confirmText="Xóa sản phẩm"
        cancelText="Hủy"
        loading={submitting}
      />
    </div>
  );
};

export default AdminProductsPage;
