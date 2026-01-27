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
  FiZap,
  FiTarget,
  FiAlertCircle,
  FiStar,
  FiMessageCircle,
  FiExternalLink,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiAward,
  FiPieChart,
  FiBarChart2,
  FiCpu,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { trackingService } from '../../services/trackingService';
import { formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';

/**
 * Format time ago
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

/**
 * Lead Score Badge Component
 */
const LeadScoreBadge = ({ score }) => {
  let color, label, bgColor;

  if (score >= 80) {
    color = 'text-green-700';
    bgColor = 'bg-green-100 border-green-300';
    label = 'HOT';
  } else if (score >= 60) {
    color = 'text-yellow-700';
    bgColor = 'bg-yellow-100 border-yellow-300';
    label = 'WARM';
  } else if (score >= 40) {
    color = 'text-blue-700';
    bgColor = 'bg-blue-100 border-blue-300';
    label = 'COOL';
  } else {
    color = 'text-gray-600';
    bgColor = 'bg-gray-100 border-gray-300';
    label = 'NEW';
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${bgColor}`}>
      <div className={`text-lg font-bold ${color}`}>{score || '-'}</div>
      <span className={`text-xs font-semibold uppercase ${color}`}>{label}</span>
    </div>
  );
};

/**
 * AI Analysis Modal
 */
const AIAnalysisModal = ({ lead, onClose, insights, loading }) => {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FiCpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Phân tích AI</h2>
                <p className="text-purple-200 text-sm">{lead.info?.name || lead.info?.phone || 'Lead #' + lead._id?.slice(-6)}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FiLoader className="w-12 h-12 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-600">AI đang phân tích hành vi khách hàng...</p>
            </div>
          ) : insights ? (
            <div className="space-y-6">
              {/* Lead Score */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Điểm tiềm năng</p>
                  <p className="text-3xl font-bold text-purple-700">{insights.leadScore}<span className="text-lg">/100</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Ý định mua hàng</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${insights.purchaseIntent === 'Cao' ? 'bg-green-100 text-green-700' :
                    insights.purchaseIntent === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                    {insights.purchaseIntent}
                  </span>
                </div>
              </div>

              {/* Suggested Action */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <FiTarget className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Hành động khuyến nghị</span>
                </div>
                <p className="text-blue-700">{insights.suggestedAction}</p>
              </div>

              {/* Insights */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FiZap className="text-yellow-500" />
                  Phân tích hành vi
                </h3>
                <ul className="space-y-2">
                  {insights.insights?.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Products */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FiStar className="text-yellow-500" />
                  Sản phẩm nên giới thiệu
                </h3>
                <div className="flex flex-wrap gap-2">
                  {insights.recommendedProducts?.map((product, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              {/* Talking Points */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <FiMessageCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Điểm tư vấn quan trọng</span>
                </div>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li>• Chào hỏi và xác nhận danh tính khách hàng</li>
                  <li>• Đề cập đến sản phẩm họ quan tâm: <strong>{lead.topInterest || 'các sản phẩm Apple'}</strong></li>
                  <li>• Hỏi về nhu cầu cụ thể và ngân sách</li>
                  <li>• Giới thiệu ưu đãi hiện tại nếu có</li>
                  <li>• Đề xuất lịch hẹn xem trực tiếp nếu phù hợp</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Không có dữ liệu phân tích
            </div>
          )}
        </div>

        {/* Footer */}
        {insights && lead.info?.phone && (
          <div className="border-t p-4 bg-gray-50">
            <a
              href={`tel:${lead.info.phone}`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              <FiPhone className="w-5 h-5" />
              Gọi ngay: {lead.info.phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Main AdminLeadsPage Component
 */
const AdminLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [marketInsights, setMarketInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // AI Analysis Modal
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadInsights, setLeadInsights] = useState(null);
  const [leadAiLoading, setLeadAiLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    hasPhone: true,
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
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Lỗi khi tải danh sách leads');
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

  // Fetch AI Market Insights
  const fetchMarketInsights = async () => {
    try {
      setAiLoading(true);
      const response = await trackingService.getMarketInsights();
      if (response.success) {
        setMarketInsights(response);
      }
    } catch (error) {
      console.error('Error fetching market insights:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // Analyze single lead with AI
  const analyzeLeadWithAI = async (lead) => {
    setSelectedLead(lead);
    setLeadInsights(null);
    setLeadAiLoading(true);

    try {
      const response = await trackingService.getLeadAIInsight(lead._id);
      if (response.success) {
        setLeadInsights(response.insights);
      }
    } catch (error) {
      console.error('Error analyzing lead:', error);
      toast.error('Không thể phân tích lead này');
    } finally {
      setLeadAiLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
    fetchMarketInsights();
  }, [filters.page, filters.hasPhone, filters.hasEmail]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  // Calculate lead engagement score locally (simple heuristic)
  const calculateLocalScore = (lead) => {
    let score = 0;
    if (lead.info?.phone) score += 30;
    if (lead.info?.email) score += 20;
    if (lead.info?.name) score += 10;
    if (lead.viewedCount > 5) score += 20;
    else if (lead.viewedCount > 2) score += 10;
    if (lead.tags?.includes('High Spender')) score += 20;
    // Recent activity bonus
    const hoursAgo = lead.lastActive ? (Date.now() - new Date(lead.lastActive).getTime()) / 3600000 : 999;
    if (hoursAgo < 24) score += 10;
    return Math.min(score, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AI Analysis Modal */}
      {selectedLead && (
        <AIAnalysisModal
          lead={selectedLead}
          insights={leadInsights}
          loading={leadAiLoading}
          onClose={() => setSelectedLead(null)}
        />
      )}

      <div className="p-6 max-w-7xl mx-auto">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FiActivity className="w-5 h-5 text-white" />
                </div>
                Behavioral Intelligence
              </h1>
              <p className="text-gray-500 mt-1">Phân tích hành vi khách hàng & Dự đoán tiềm năng mua hàng</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchMarketInsights}
                disabled={aiLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <FiCpu className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
                AI Analysis
              </button>
              <button
                onClick={() => { fetchLeads(); fetchStats(); }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tổng Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Có SĐT</p>
                  <p className="text-3xl font-bold text-green-600">{stats.leadsWithPhone}</p>
                  <p className="text-xs text-gray-400">{stats.totalLeads > 0 ? Math.round(stats.leadsWithPhone / stats.totalLeads * 100) : 0}% conversion</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <FiPhone className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">High Spender</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.highSpenderLeads}</p>
                  <p className="text-xs text-gray-400">Khách VIP tiềm năng</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <FiDollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">7 Ngày Qua</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.recentLeads}</p>
                  <p className="text-xs text-gray-400">Leads mới</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Market Insights Panel */}
        {marketInsights?.insights && (
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiCpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">AI Market Intelligence</h2>
                <p className="text-purple-200 text-sm">Powered by Google Gemini</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiTrendingUp className="w-4 h-4 text-purple-200" />
                  <span className="text-sm font-medium text-purple-200">Xu hướng</span>
                </div>
                <p className="text-white text-sm">{marketInsights.insights.marketTrend}</p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiTarget className="w-4 h-4 text-purple-200" />
                  <span className="text-sm font-medium text-purple-200">Hot Products</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {marketInsights.insights.hotProducts?.slice(0, 3).map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/20 rounded text-xs">{p}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiAlertCircle className="w-4 h-4 text-purple-200" />
                  <span className="text-sm font-medium text-purple-200">Khuyến nghị</span>
                </div>
                <p className="text-white text-sm">{marketInsights.insights.recommendations?.[0]}</p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiZap className="w-4 h-4 text-purple-200" />
                  <span className="text-sm font-medium text-purple-200">Mẹo chuyển đổi</span>
                </div>
                <p className="text-white text-sm">{marketInsights.insights.conversionTips?.[0]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FiFilter className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-700">Bộ lọc:</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={filters.hasPhone}
                onChange={(e) => handleFilterChange('hasPhone', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Có số điện thoại</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={filters.hasEmail}
                onChange={(e) => handleFilterChange('hasEmail', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Có email</span>
            </label>

            <div className="ml-auto text-sm text-gray-500">
              {pagination?.total || 0} leads
            </div>
          </div>
        </div>

        {/* Leads Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <FiLoader className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-500">Đang tải danh sách leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có leads nào</p>
              <p className="text-gray-400 text-sm mt-1">Leads sẽ xuất hiện khi khách hàng duyệt website</p>
            </div>
          ) : (
            leads.map((lead) => {
              const score = calculateLocalScore(lead);
              const isHot = score >= 70;

              return (
                <div
                  key={lead._id}
                  className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${isHot ? 'border-l-4 border-l-green-500 border-t-0 border-r-0 border-b-0' : 'border-gray-100'
                    }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Lead Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isHot ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                            }`}>
                            <FiUser className={`w-6 h-6 ${isHot ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {lead.info?.name || 'Khách hàng ẩn danh'}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              {lead.info?.phone && (
                                <span className="flex items-center gap-1">
                                  <FiPhone className="w-3 h-3" />
                                  {lead.info.phone}
                                </span>
                              )}
                              {lead.info?.email && (
                                <span className="flex items-center gap-1 truncate">
                                  <FiMail className="w-3 h-3" />
                                  {lead.info.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Behavior Summary */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <FiEye className="w-4 h-4 text-blue-500" />
                            <span><strong>{lead.viewedCount || 0}</strong> sản phẩm đã xem</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <FiTarget className="w-4 h-4 text-purple-500" />
                            <span>Quan tâm: <strong>{lead.topInterest || 'Chưa xác định'}</strong></span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <FiClock className="w-4 h-4 text-orange-500" />
                            <span>{formatTimeAgo(lead.lastActive)}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {lead.tags && lead.tags.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {lead.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${tag === 'High Spender'
                                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                  : 'bg-gray-100 text-gray-600'
                                  }`}
                              >
                                {tag === 'High Spender' && <FiAward className="inline w-3 h-3 mr-1" />}
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Score & Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <LeadScoreBadge score={score} />

                        <div className="flex gap-2">
                          <Link
                            to={`/admin/leads/${lead._id}`}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                            Chi tiết
                          </Link>

                          <button
                            onClick={() => analyzeLeadWithAI(lead)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                          >
                            <FiCpu className="w-4 h-4" />
                            Phân tích AI
                          </button>

                          {lead.info?.phone && (
                            <a
                              href={`tel:${lead.info.phone}`}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                            >
                              <FiPhone className="w-4 h-4" />
                              Gọi
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Trang {pagination.currentPage} / {pagination.pages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeadsPage;
