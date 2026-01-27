import { useState, useEffect } from 'react';
import {
  FiLoader,
  FiPhone,
  FiMail,
  FiUser,
  FiTrendingUp,
  FiClock,
  FiEye,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
} from 'react-icons/fi';
import { trackingService } from '../../services/trackingService';
import { formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';

/**
 * Format time ago (e.g., "2 mins ago", "1 hour ago")
 */
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  
  return formatDate(dateString, { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const AdminLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    hasPhone: true, // Default: only show actionable leads
    hasEmail: false,
    page: 1,
    limit: 20,
  });

  // Fetch leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        limit: filters.limit,
        sort: 'lastActive',
        order: 'desc',
        hasPhone: filters.hasPhone,
        hasEmail: filters.hasEmail,
      };

      const response = await trackingService.getLeads(params);
      
      if (response.success) {
        setLeads(response.leads || []);
        setPagination(response.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 1,
          hasNext: false,
          hasPrev: false,
        });
      } else {
        toast.error(response.message || 'Lỗi khi tải danh sách leads');
        setLeads([]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Lỗi khi tải danh sách leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await trackingService.getLeadStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [filters.page, filters.hasPhone, filters.hasEmail]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page
    }));
  };

  // Check if lead has phone but hasn't purchased (highlight)
  const isActionableLead = (lead) => {
    return lead.info?.phone && !lead.hasPurchased;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Leads</h1>
          <p className="text-gray-600">Theo dõi hành vi khách hàng và tạo leads</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Có Số Điện Thoại</p>
                  <p className="text-2xl font-bold text-green-600">{stats.leadsWithPhone}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiPhone className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Spender</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.highSpenderLeads}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiTrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">7 Ngày Qua</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.recentLeads}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FiFilter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Lọc:</span>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasPhone}
                onChange={(e) => handleFilterChange('hasPhone', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Có số điện thoại</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasEmail}
                onChange={(e) => handleFilterChange('hasEmail', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Có email</span>
            </label>

            <button
              onClick={fetchLeads}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Đang tải...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Không có leads nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thông tin khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sở thích chính
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hoạt động cuối
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượt xem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead) => {
                      const isActionable = isActionableLead(lead);
                      return (
                        <tr
                          key={lead._id}
                          className={`hover:bg-gray-50 transition-colors ${
                            isActionable ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                          }`}
                        >
                          {/* Customer Info */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              {lead.info?.name && (
                                <div className="flex items-center gap-2">
                                  <FiUser className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium text-gray-900">{lead.info.name}</span>
                                </div>
                              )}
                              {lead.info?.phone && (
                                <div className="flex items-center gap-2">
                                  <FiPhone className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700">{lead.info.phone}</span>
                                </div>
                              )}
                              {lead.info?.email && (
                                <div className="flex items-center gap-2">
                                  <FiMail className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700 text-sm">{lead.info.email}</span>
                                </div>
                              )}
                              {!lead.info?.name && !lead.info?.phone && !lead.info?.email && (
                                <span className="text-gray-400 text-sm">Chưa có thông tin</span>
                              )}
                            </div>
                          </td>

                          {/* Top Interest */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FiTrendingUp className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-900 font-medium">
                                {lead.topInterest || 'Chưa xác định'}
                              </span>
                            </div>
                            {lead.tags && lead.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {lead.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Last Active */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FiClock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{formatTimeAgo(lead.lastActive)}</span>
                            </div>
                          </td>

                          {/* Viewed Count */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FiEye className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 font-medium">{lead.viewedCount || 0}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {lead.info?.phone ? (
                              <a
                                href={`tel:${lead.info.phone}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <FiPhone className="w-4 h-4" />
                                <span>Gọi ngay</span>
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">Chưa có số điện thoại</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Hiển thị {((pagination.currentPage - 1) * pagination.limit) + 1} -{' '}
                    {Math.min(pagination.currentPage * pagination.limit, pagination.total)} trong tổng số{' '}
                    {pagination.total} leads
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Trang {pagination.currentPage} / {pagination.pages}
                    </span>
                    <button
                      onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLeadsPage;
