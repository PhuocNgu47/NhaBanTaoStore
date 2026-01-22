import { useState, useEffect, useMemo } from 'react';
import {
  FiPackage,
  FiAlertTriangle,
  FiTrendingUp,
  FiTrendingDown,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiSave,
  FiX,
  FiLoader,
  FiChevronDown,
  FiChevronRight,
  FiBox,
  FiRefreshCw,
} from 'react-icons/fi';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/helpers';
import { toast } from 'react-toastify';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedProducts, setExpandedProducts] = useState({});
  const [editingStock, setEditingStock] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ limit: 500 });
      if (response.success) {
        setProducts(response.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.filter(Boolean).sort();
  }, [products]);

  // Calculate inventory stats
  const stats = useMemo(() => {
    let totalItems = 0;
    let totalValue = 0;
    let lowStock = 0;
    let outOfStock = 0;

    products.forEach(product => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          const stock = variant.stock || 0;
          totalItems += stock;
          totalValue += stock * (variant.costPrice || variant.price || 0);
          if (stock === 0) outOfStock++;
          else if (stock <= (variant.lowStockThreshold || 5)) lowStock++;
        });
      } else {
        const stock = product.stock || 0;
        totalItems += stock;
        totalValue += stock * (product.price || 0);
        if (stock === 0) outOfStock++;
        else if (stock <= 5) lowStock++;
      }
    });

    return { totalItems, totalValue, lowStock, outOfStock };
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = 
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      // Stock filter
      let matchesStock = true;
      if (stockFilter !== 'all') {
        const hasVariants = product.variants && product.variants.length > 0;
        
        if (stockFilter === 'out-of-stock') {
          if (hasVariants) {
            matchesStock = product.variants.some(v => (v.stock || 0) === 0);
          } else {
            matchesStock = (product.stock || 0) === 0;
          }
        } else if (stockFilter === 'low-stock') {
          if (hasVariants) {
            matchesStock = product.variants.some(v => {
              const stock = v.stock || 0;
              const threshold = v.lowStockThreshold || 5;
              return stock > 0 && stock <= threshold;
            });
          } else {
            matchesStock = (product.stock || 0) > 0 && (product.stock || 0) <= 5;
          }
        } else if (stockFilter === 'in-stock') {
          if (hasVariants) {
            matchesStock = product.variants.every(v => (v.stock || 0) > 5);
          } else {
            matchesStock = (product.stock || 0) > 5;
          }
        }
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  // Toggle expanded product
  const toggleExpand = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Start editing stock
  const startEditStock = (productId, variantId, currentStock) => {
    setEditingStock({ productId, variantId });
    setNewStockValue(currentStock.toString());
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingStock(null);
    setNewStockValue('');
  };

  // Save stock update
  const saveStock = async (productId, variantId) => {
    const newStock = parseInt(newStockValue);
    if (isNaN(newStock) || newStock < 0) {
      toast.error('Số lượng không hợp lệ');
      return;
    }

    try {
      setSaving(true);
      const product = products.find(p => p._id === productId);
      
      if (variantId) {
        // Update variant stock
        const updatedVariants = product.variants.map(v => 
          v._id === variantId ? { ...v, stock: newStock } : v
        );
        await productService.updateProduct(productId, { variants: updatedVariants });
      } else {
        // Update product stock
        await productService.updateProduct(productId, { stock: newStock });
      }

      toast.success('Đã cập nhật tồn kho');
      cancelEdit();
      fetchProducts();
    } catch (error) {
      toast.error('Lỗi khi cập nhật tồn kho');
    } finally {
      setSaving(false);
    }
  };

  // Get stock status
  const getStockStatus = (stock, threshold = 5) => {
    if (stock === 0) return { label: 'Hết hàng', color: 'bg-red-100 text-red-600', icon: FiAlertTriangle };
    if (stock <= threshold) return { label: 'Sắp hết', color: 'bg-yellow-100 text-yellow-600', icon: FiTrendingDown };
    return { label: 'Còn hàng', color: 'bg-green-100 text-green-600', icon: FiTrendingUp };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý tồn kho</h1>
          <p className="text-gray-500 text-sm">Theo dõi và cập nhật số lượng sản phẩm</p>
        </div>
        <button
          onClick={fetchProducts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
        >
          <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiPackage className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalItems.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Tổng tồn kho</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{formatPrice(stats.totalValue)}</p>
              <p className="text-sm text-gray-500">Giá trị tồn kho</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              <p className="text-sm text-gray-500">Sắp hết hàng</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiBox className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              <p className="text-sm text-gray-500">Hết hàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="in-stock">Còn hàng</option>
          <option value="low-stock">Sắp hết hàng</option>
          <option value="out-of-stock">Hết hàng</option>
        </select>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy sản phẩm</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500 border-b">
                  <th className="p-4 font-medium w-12"></th>
                  <th className="p-4 font-medium">Sản phẩm</th>
                  <th className="p-4 font-medium">SKU</th>
                  <th className="p-4 font-medium">Danh mục</th>
                  <th className="p-4 font-medium text-center">Tồn kho</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const hasVariants = product.variants && product.variants.length > 0;
                  const isExpanded = expandedProducts[product._id];
                  const totalStock = hasVariants 
                    ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
                    : (product.stock || 0);
                  const stockStatus = getStockStatus(totalStock);
                  const StatusIcon = stockStatus.icon;

                  return (
                    <>
                      {/* Product Row */}
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          {hasVariants && (
                            <button
                              onClick={() => toggleExpand(product._id)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {isExpanded ? (
                                <FiChevronDown className="w-5 h-5 text-gray-500" />
                              ) : (
                                <FiChevronRight className="w-5 h-5 text-gray-500" />
                              )}
                            </button>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image || product.thumbnail || '/images/placeholder.png'}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                              {hasVariants && (
                                <p className="text-xs text-gray-500">{product.variants.length} biến thể</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-sm text-gray-600">{product.sku || '-'}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600">{product.category}</span>
                        </td>
                        <td className="p-4 text-center">
                          {editingStock?.productId === product._id && !editingStock?.variantId ? (
                            <input
                              type="number"
                              value={newStockValue}
                              onChange={(e) => setNewStockValue(e.target.value)}
                              className="w-20 px-2 py-1 border rounded text-center"
                              autoFocus
                            />
                          ) : (
                            <span className="font-bold text-lg">{totalStock}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {stockStatus.label}
                          </span>
                        </td>
                        <td className="p-4">
                          {!hasVariants && (
                            <div className="flex items-center gap-1">
                              {editingStock?.productId === product._id && !editingStock?.variantId ? (
                                <>
                                  <button
                                    onClick={() => saveStock(product._id, null)}
                                    disabled={saving}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                  >
                                    {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => startEditStock(product._id, null, product.stock || 0)}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title="Sửa tồn kho"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Variant Rows */}
                      {hasVariants && isExpanded && product.variants.map((variant) => {
                        const variantStatus = getStockStatus(variant.stock || 0, variant.lowStockThreshold || 5);
                        const VariantStatusIcon = variantStatus.icon;

                        return (
                          <tr key={variant._id} className="border-b bg-gray-50/50 hover:bg-gray-100/50">
                            <td className="p-4"></td>
                            <td className="p-4 pl-12">
                              <div className="flex items-center gap-3">
                                {variant.image && (
                                  <img
                                    src={variant.image}
                                    alt={variant.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <p className="text-sm text-gray-700">{variant.name || 'Biến thể'}</p>
                                  <div className="flex gap-2 text-xs text-gray-500">
                                    {variant.attributes?.color && <span>Màu: {variant.attributes.color}</span>}
                                    {variant.attributes?.storage && <span>• {variant.attributes.storage}</span>}
                                    {variant.type && <span>• {variant.type}</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-mono text-xs text-gray-500">{variant.sku}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-gray-600">{formatPrice(variant.price)}</span>
                            </td>
                            <td className="p-4 text-center">
                              {editingStock?.productId === product._id && editingStock?.variantId === variant._id ? (
                                <input
                                  type="number"
                                  value={newStockValue}
                                  onChange={(e) => setNewStockValue(e.target.value)}
                                  className="w-20 px-2 py-1 border rounded text-center"
                                  autoFocus
                                />
                              ) : (
                                <span className="font-medium">{variant.stock || 0}</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${variantStatus.color}`}>
                                <VariantStatusIcon className="w-3 h-3" />
                                {variantStatus.label}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                {editingStock?.productId === product._id && editingStock?.variantId === variant._id ? (
                                  <>
                                    <button
                                      onClick={() => saveStock(product._id, variant._id)}
                                      disabled={saving}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                    >
                                      {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                                    >
                                      <FiX className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => startEditStock(product._id, variant._id, variant.stock || 0)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                    title="Sửa tồn kho"
                                  >
                                    <FiEdit2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
