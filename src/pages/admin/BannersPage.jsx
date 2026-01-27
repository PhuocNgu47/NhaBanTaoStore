import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiLoader, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  clearError,
  clearSuccess,
} from '../../features/bannerSlice';
import { toast } from 'react-toastify';
import { Loading } from '../../components/common';

const initialFormState = {
  title: '',
  subtitle: '',
  image: null,
  imageUrl: '',
  link: '/san-pham',
  buttonText: 'TÌM HIỂU NGAY',
  isActive: true,
  displayOrder: 0,
  startDate: '',
  endDate: '',
  saleLabel: '',
  salePercent: 0,
  backgroundImage: null,
  backgroundImageUrl: '',
  backgroundColor: '',
  textColor: 'white',
};

const BannersPage = () => {
  const dispatch = useDispatch();
  const { allBanners, loading, error, success } = useSelector((state) => state.banners);

  // State
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deletingBanner, setDeletingBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);
  const [bgImagePreview, setBgImagePreview] = useState(null);
  const [isActiveFilter, setIsActiveFilter] = useState('all');

  // Fetch banners
  const fetchBanners = useCallback(async () => {
    const params = {};
    if (isActiveFilter !== 'all') {
      params.isActive = isActiveFilter === 'active';
    }
    dispatch(fetchAllBanners(params));
  }, [dispatch, isActiveFilter]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success('Thao tác thành công!');
      dispatch(clearSuccess());
      handleCloseModal();
      fetchBanners();
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch, fetchBanners]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file, imageUrl: '' }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image URL input
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, imageUrl: url, image: null }));
    setImagePreview(url);
  };

  // Handle background image upload
  const handleBgImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, backgroundImage: file, backgroundImageUrl: '' }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle background image URL input
  const handleBgImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, backgroundImageUrl: url, backgroundImage: null }));
    setBgImagePreview(url);
  };

  // Open modal for create
  const handleCreate = () => {
    setEditingBanner(null);
    setFormData(initialFormState);
    setImagePreview(null);
    setBgImagePreview(null);
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: null,
      imageUrl: banner.image || '',
      link: banner.link || '/san-pham',
      buttonText: banner.buttonText || 'TÌM HIỂU NGAY',
      isActive: banner.isActive ?? true,
      displayOrder: banner.displayOrder || 0,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
      saleLabel: banner.saleLabel || '',
      salePercent: banner.salePercent || 0,
      saleLabel: banner.saleLabel || '',
      salePercent: banner.salePercent || 0,
      backgroundImage: null,
      backgroundImageUrl: banner.backgroundImage || '',
      backgroundColor: banner.backgroundColor || '',
      textColor: banner.textColor || 'white',
    });
    setImagePreview(banner.image);
    setBgImagePreview(banner.backgroundImage);
    setShowModal(true);
  };

  // Handle preview
  const handlePreview = (banner) => {
    setPreviewBanner(banner);
    setShowPreviewModal(true);
  };

  // Handle delete
  const handleDeleteClick = (banner) => {
    setDeletingBanner(banner);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deletingBanner) {
      dispatch(deleteBanner(deletingBanner._id));
      setShowDeleteModal(false);
      setDeletingBanner(null);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      salePercent: Number(formData.salePercent) || 0,
      displayOrder: Number(formData.displayOrder) || 0,
    };

    // Use image file if uploaded, otherwise use imageUrl
    if (formData.image) {
      submitData.image = formData.image;
    } else if (formData.imageUrl) {
      submitData.image = formData.imageUrl;
    }

    // Handle background image
    if (formData.backgroundImage) {
      submitData.backgroundImage = formData.backgroundImage;
    } else if (formData.backgroundImageUrl) {
      submitData.backgroundImage = formData.backgroundImageUrl;
    } else {
      // If we are clearing background image or keeping existing string
      submitData.backgroundImage = formData.backgroundImageUrl;
    }

    if (editingBanner) {
      dispatch(updateBanner({ id: editingBanner._id, bannerData: submitData }));
    } else {
      dispatch(createBanner(submitData));
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData(initialFormState);
    setImagePreview(null);
    setBgImagePreview(null);
  };

  // Get image URL for display
  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return image.startsWith('/') ? `${baseURL}${image}` : `${baseURL}/${image}`;
  };

  // Filtered banners
  const filteredBanners = allBanners.filter((banner) => {
    if (isActiveFilter === 'all') return true;
    return isActiveFilter === 'active' ? banner.isActive : !banner.isActive;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Banner</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus /> Thêm Banner
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4 flex gap-4">
        <select
          value={isActiveFilter}
          onChange={(e) => setIsActiveFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">Tất cả</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <Loading />}

      {/* Banners Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ảnh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thứ tự</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày bắt đầu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày kết thúc</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Chưa có banner nào
                  </td>
                </tr>
              ) : (
                filteredBanners.map((banner) => (
                  <tr key={banner._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={getImageUrl(banner.image)}
                        alt={banner.title}
                        className="w-20 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = '/placeholder-banner.jpg';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{banner.title}</div>
                      {banner.subtitle && (
                        <div className="text-sm text-gray-500">{banner.subtitle}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {banner.salePercent > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                          {banner.salePercent}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{banner.displayOrder}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 whitespace-nowrap rounded text-sm ${banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {banner.isActive ? 'Hoạt động' : 'Tắt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {banner.startDate
                        ? new Date(banner.startDate).toLocaleDateString('vi-VN')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {banner.endDate
                        ? new Date(banner.endDate).toLocaleDateString('vi-VN')
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreview(banner)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Xem trước"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => handleEdit(banner)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Sửa"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(banner)}
                          className="text-red-600 hover:text-red-800"
                          title="Xóa"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingBanner ? 'Sửa Banner' : 'Thêm Banner'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Ảnh Banner *</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border rounded-lg p-2 w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">Hoặc nhập URL ảnh:</p>
                      <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleImageUrlChange}
                        placeholder="https://example.com/image.jpg"
                        className="border rounded-lg p-2 w-full mt-1"
                      />
                    </div>
                    {imagePreview && (
                      <div className="w-32 h-20 border rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-banner.jpg';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Background */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-3 text-gray-700">Tùy chỉnh nền (Tùy chọn)</h3>

                  {/* Background Image */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Ảnh nền banner</label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBgImageChange}
                          className="border rounded-lg p-2 w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">Hoặc nhập URL ảnh nền:</p>
                        <input
                          type="text"
                          name="backgroundImageUrl"
                          value={formData.backgroundImageUrl}
                          onChange={handleBgImageUrlChange}
                          placeholder="https://example.com/bg.jpg"
                          className="border rounded-lg p-2 w-full mt-1"
                        />
                      </div>
                      {bgImagePreview && (
                        <div className="w-32 h-20 border rounded-lg overflow-hidden">
                          <img
                            src={bgImagePreview}
                            alt="Background Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Background Color */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Màu nền (nếu không có ảnh)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          name="backgroundColor"
                          value={formData.backgroundColor || '#000000'}
                          onChange={handleInputChange}
                          className="w-10 h-10 border rounded cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          name="backgroundColor"
                          value={formData.backgroundColor}
                          onChange={handleInputChange}
                          placeholder="Mã màu (VD: #0f172a)"
                          className="border rounded-lg p-2 flex-1"
                        />
                      </div>
                    </div>

                    {/* Text Color */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Màu chữ</label>
                      <select
                        name="textColor"
                        value={formData.textColor}
                        onChange={handleInputChange}
                        className="border rounded-lg p-2 w-full"
                      >
                        <option value="white">Màu trắng (White)</option>
                        <option value="black">Màu đen (Black)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="border rounded-lg p-2 w-full"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium mb-2">Mô tả</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium mb-2">Link</label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>

                {/* Button Text */}
                <div>
                  <label className="block text-sm font-medium mb-2">Nút CTA (Button Text)</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    placeholder="TÌM HIỂU NGAY"
                    className="border rounded-lg p-2 w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Văn bản hiển thị trên nút CTA</p>
                </div>

                {/* Sale Label & Percent */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nhãn Sale</label>
                    <input
                      type="text"
                      name="saleLabel"
                      value={formData.saleLabel}
                      onChange={handleInputChange}
                      placeholder="SALE LỚN"
                      className="border rounded-lg p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">% Giảm giá</label>
                    <input
                      type="number"
                      name="salePercent"
                      value={formData.salePercent}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="border rounded-lg p-2 w-full"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày bắt đầu</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày kết thúc</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                    />
                  </div>
                </div>

                {/* Display Order & Active */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Thứ tự hiển thị</label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleInputChange}
                      min="0"
                      className="border rounded-lg p-2 w-full"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                      />
                      <span>Đang hoạt động</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={loading}
                >
                  {loading ? <FiLoader className="animate-spin mx-auto" /> : 'Lưu'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="mb-6">
              Bạn có chắc chắn muốn xóa banner "{deletingBanner?.title}"?
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Xóa
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingBanner(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Xem trước Banner</h2>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewBanner(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div
              className="relative min-h-[300px] rounded-lg overflow-hidden flex items-center"
              style={{
                background: previewBanner.backgroundImageUrl || previewBanner.backgroundImage
                  ? `url(${previewBanner.backgroundImageUrl || (typeof previewBanner.backgroundImage === 'string' ? previewBanner.backgroundImage : bgImagePreview)}) center/cover no-repeat`
                  : previewBanner.backgroundColor || 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)'
              }}
            >
              <div className="absolute inset-0 bg-black/40" />

              <div className="relative w-full p-8 grid grid-cols-5 gap-4 items-center">
                <div className="col-span-3">
                  {previewBanner.saleLabel && (
                    <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full mb-4 text-white text-sm font-bold shadow-lg">
                      {previewBanner.saleLabel}
                      {previewBanner.salePercent > 0 && ` - ${previewBanner.salePercent}%`}
                    </div>
                  )}
                  <h1 className={`text-3xl font-bold mb-2 ${previewBanner.textColor === 'black' ? 'text-gray-900' : 'text-white'}`}>
                    {previewBanner.title}
                  </h1>
                  {previewBanner.subtitle && (
                    <p className={`text-lg mb-4 line-clamp-2 ${previewBanner.textColor === 'black' ? 'text-gray-700' : 'text-gray-200'}`}>
                      {previewBanner.subtitle}
                    </p>
                  )}
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg">
                    {previewBanner.buttonText || 'Khám phá'}
                  </button>
                </div>

                <div className="col-span-2 flex justify-center">
                  {previewBanner.image && (getImageUrl(previewBanner.image) || imagePreview) && (
                    <img
                      src={imagePreview || getImageUrl(previewBanner.image)}
                      alt={previewBanner.title}
                      className="max-h-[200px] w-auto object-contain drop-shadow-2xl"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannersPage;
