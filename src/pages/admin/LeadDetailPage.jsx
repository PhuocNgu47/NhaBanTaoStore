import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FiLoader,
    FiPhone,
    FiMail,
    FiUser,
    FiTrendingUp,
    FiClock,
    FiEye,
    FiArrowLeft,
    FiZap,
    FiTarget,
    FiStar,
    FiMessageCircle,
    FiCalendar,
    FiDollarSign,
    FiActivity,
    FiAward,
    FiCpu,
    FiShoppingBag,
    FiExternalLink,
    FiRefreshCw,
    FiEdit3,
    FiSave,
    FiX,
} from 'react-icons/fi';
import { trackingService } from '../../services/trackingService';
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

    return date.toLocaleDateString('vi-VN');
};

/**
 * Format price to VND
 */
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price || 0);
};

/**
 * Lead Score Circle
 */
const LeadScoreCircle = ({ score }) => {
    let color, label;

    if (score >= 80) {
        color = 'from-green-400 to-emerald-500';
        label = 'HOT LEAD';
    } else if (score >= 60) {
        color = 'from-yellow-400 to-orange-500';
        label = 'WARM';
    } else if (score >= 40) {
        color = 'from-blue-400 to-indigo-500';
        label = 'COOL';
    } else {
        color = 'from-gray-300 to-gray-400';
        label = 'NEW';
    }

    return (
        <div className="text-center">
            <div className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-800">{score || 0}</span>
                </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-600">{label}</p>
            <p className="text-xs text-gray-400">Lead Score</p>
        </div>
    );
};

/**
 * Main LeadDetailPage Component
 */
const LeadDetailPage = () => {
    const { id } = useParams();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiInsights, setAiInsights] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [notes, setNotes] = useState('');
    const [editingNotes, setEditingNotes] = useState(false);

    // Fetch lead detail
    const fetchLead = async () => {
        try {
            setLoading(true);
            // For now, we fetch all leads and find the one we need
            // In production, you'd have a dedicated endpoint
            const response = await trackingService.getLeads({ limit: 100 });
            if (response.success) {
                const foundLead = response.leads.find(l => l._id === id);
                if (foundLead) {
                    setLead(foundLead);
                } else {
                    toast.error('Không tìm thấy lead');
                }
            }
        } catch (error) {
            console.error('Error fetching lead:', error);
            toast.error('Lỗi khi tải thông tin lead');
        } finally {
            setLoading(false);
        }
    };

    // Fetch AI insights
    const fetchAIInsights = async () => {
        if (!id) return;

        try {
            setAiLoading(true);
            const response = await trackingService.getLeadAIInsight(id);
            if (response.success) {
                setAiInsights(response.insights);
            }
        } catch (error) {
            console.error('Error fetching AI insights:', error);
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchLead();
            fetchAIInsights();
        }
    }, [id]);

    // Calculate local score
    const calculateScore = (lead) => {
        if (!lead) return 0;
        let score = 0;
        if (lead.info?.phone) score += 30;
        if (lead.info?.email) score += 20;
        if (lead.info?.name) score += 10;
        if (lead.viewedCount > 5) score += 20;
        else if (lead.viewedCount > 2) score += 10;
        if (lead.tags?.includes('High Spender')) score += 20;
        const hoursAgo = lead.lastActive ? (Date.now() - new Date(lead.lastActive).getTime()) / 3600000 : 999;
        if (hoursAgo < 24) score += 10;
        return Math.min(score, 100);
    };

    // Calculate category breakdown
    const getCategoryBreakdown = (lead) => {
        if (!lead?.viewedProducts) return [];

        const categoryCount = {};
        lead.viewedProducts.forEach(p => {
            const cat = p.category || 'Khác';
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });

        const total = lead.viewedProducts.length;
        return Object.entries(categoryCount)
            .map(([name, count]) => ({
                name,
                count,
                percentage: Math.round((count / total) * 100)
            }))
            .sort((a, b) => b.count - a.count);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FiLoader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải thông tin lead...</p>
                </div>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Không tìm thấy lead</p>
                    <Link to="/admin/leads" className="text-purple-600 hover:underline">
                        ← Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    const score = calculateScore(lead);
    const categories = getCategoryBreakdown(lead);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Back Button & Header */}
                <div className="mb-6">
                    <Link
                        to="/admin/leads"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Quay lại danh sách Leads
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {lead.info?.name || 'Khách hàng ẩn danh'}
                            </h1>
                            <p className="text-gray-500">Lead ID: {lead._id?.slice(-8)}</p>
                        </div>

                        {lead.info?.phone && (
                            <a
                                href={`tel:${lead.info.phone}`}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
                            >
                                <FiPhone className="w-5 h-5" />
                                Gọi ngay: {lead.info.phone}
                            </a>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Lead Info & Score */}
                    <div className="space-y-6">
                        {/* Lead Score Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiTarget className="text-purple-500" />
                                Lead Score
                            </h2>

                            <LeadScoreCircle score={score} />

                            {/* Score Breakdown */}
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Có số điện thoại</span>
                                    <span className={lead.info?.phone ? 'text-green-600 font-medium' : 'text-gray-400'}>
                                        {lead.info?.phone ? '+30' : '+0'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Có email</span>
                                    <span className={lead.info?.email ? 'text-green-600 font-medium' : 'text-gray-400'}>
                                        {lead.info?.email ? '+20' : '+0'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Số sản phẩm đã xem</span>
                                    <span className="text-blue-600 font-medium">+{lead.viewedCount > 5 ? 20 : lead.viewedCount > 2 ? 10 : 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">High Spender</span>
                                    <span className={lead.tags?.includes('High Spender') ? 'text-yellow-600 font-medium' : 'text-gray-400'}>
                                        {lead.tags?.includes('High Spender') ? '+20' : '+0'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiUser className="text-blue-500" />
                                Thông tin liên hệ
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <FiUser className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Họ tên</p>
                                        <p className="font-medium text-gray-900">{lead.info?.name || 'Chưa có'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FiPhone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Số điện thoại</p>
                                        <p className="font-medium text-gray-900">{lead.info?.phone || 'Chưa có'}</p>
                                    </div>
                                    {lead.info?.phone && (
                                        <a href={`tel:${lead.info.phone}`} className="text-green-600 hover:text-green-700">
                                            <FiExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FiMail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900">{lead.info?.email || 'Chưa có'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <FiClock className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Hoạt động cuối</p>
                                        <p className="font-medium text-gray-900">{formatTimeAgo(lead.lastActive)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            {lead.tags && lead.tags.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-gray-500 mb-2">Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {lead.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${tag === 'High Spender'
                                                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                                        : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {tag === 'High Spender' && <FiAward className="inline w-3 h-3 mr-1" />}
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Column - Behavior Analysis */}
                    <div className="space-y-6">
                        {/* Category Interest */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiActivity className="text-indigo-500" />
                                Phân tích sở thích
                            </h2>

                            {categories.length > 0 ? (
                                <div className="space-y-3">
                                    {categories.slice(0, 5).map((cat, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">{cat.name}</span>
                                                <span className="text-gray-500">{cat.count} lượt xem ({cat.percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${cat.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">Chưa có dữ liệu xem sản phẩm</p>
                            )}

                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Sở thích chính</span>
                                    <span className="font-semibold text-purple-600">{lead.topInterest || 'Chưa xác định'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-2">
                                    <span className="text-gray-600">Tổng sản phẩm đã xem</span>
                                    <span className="font-semibold text-gray-900">{lead.viewedCount || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Viewed Products Timeline */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiEye className="text-blue-500" />
                                Lịch sử xem sản phẩm
                            </h2>

                            {lead.viewedProducts && lead.viewedProducts.length > 0 ? (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {lead.viewedProducts.slice(0, 10).map((product, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                                                <FiShoppingBag className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{product.productName}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>{product.category}</span>
                                                    <span>•</span>
                                                    <span>{formatPrice(product.price)}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {formatTimeAgo(product.timestamp)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">Chưa xem sản phẩm nào</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - AI Insights */}
                    <div className="space-y-6">
                        {/* AI Analysis Card */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <FiCpu className="w-5 h-5" />
                                    <h2 className="text-lg font-semibold">AI Insights</h2>
                                </div>
                                <button
                                    onClick={fetchAIInsights}
                                    disabled={aiLoading}
                                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                >
                                    <FiRefreshCw className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            {aiLoading ? (
                                <div className="text-center py-8">
                                    <FiLoader className="w-10 h-10 animate-spin mx-auto mb-3" />
                                    <p className="text-purple-200">Đang phân tích...</p>
                                </div>
                            ) : aiInsights ? (
                                <div className="space-y-4">
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <p className="text-sm text-purple-200 mb-1">Ý định mua hàng</p>
                                        <p className="text-xl font-bold">{aiInsights.purchaseIntent}</p>
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-4">
                                        <p className="text-sm text-purple-200 mb-2">Hành động khuyến nghị</p>
                                        <p className="text-sm">{aiInsights.suggestedAction}</p>
                                    </div>

                                    {aiInsights.insights && (
                                        <div className="bg-white/10 rounded-xl p-4">
                                            <p className="text-sm text-purple-200 mb-2">Phân tích</p>
                                            <ul className="text-sm space-y-1">
                                                {aiInsights.insights.slice(0, 3).map((insight, idx) => (
                                                    <li key={idx} className="flex items-start gap-1">
                                                        <span className="text-purple-300">•</span>
                                                        <span>{insight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-purple-200">
                                    <FiZap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Nhấn nút làm mới để xem phân tích AI</p>
                                </div>
                            )}
                        </div>

                        {/* Consultation Script */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiMessageCircle className="text-green-500" />
                                Kịch bản tư vấn
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                    <p className="font-medium text-blue-800 mb-1">1. Mở đầu</p>
                                    <p className="text-blue-700">
                                        "Xin chào {lead.info?.name ? `anh/chị ${lead.info.name}` : 'anh/chị'}, em là [Tên] từ Cửa hàng Apple.
                                        Em thấy anh/chị đang quan tâm đến {lead.topInterest || 'sản phẩm Apple'}, em có thể tư vấn thêm không ạ?"
                                    </p>
                                </div>

                                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                    <p className="font-medium text-green-800 mb-1">2. Tìm hiểu nhu cầu</p>
                                    <p className="text-green-700">
                                        "Anh/chị đang tìm {lead.topInterest || 'sản phẩm'} để sử dụng cho mục đích gì ạ?
                                        Công việc hay giải trí?"
                                    </p>
                                </div>

                                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                                    <p className="font-medium text-purple-800 mb-1">3. Giới thiệu sản phẩm</p>
                                    <p className="text-purple-700">
                                        {aiInsights?.recommendedProducts ?
                                            `Dựa trên nhu cầu của anh/chị, em đề xuất: ${aiInsights.recommendedProducts.join(', ')}` :
                                            `Em sẽ giới thiệu các sản phẩm phù hợp với nhu cầu của anh/chị.`
                                        }
                                    </p>
                                </div>

                                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                                    <p className="font-medium text-orange-800 mb-1">4. Chốt sale</p>
                                    <p className="text-orange-700">
                                        "Hiện bên em đang có chương trình ưu đãi. Anh/chị muốn đặt lịch hẹn đến cửa hàng xem trực tiếp không ạ?"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <FiEdit3 className="text-gray-500" />
                                    Ghi chú
                                </h2>
                                {editingNotes ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingNotes(false);
                                                toast.success('Đã lưu ghi chú');
                                            }}
                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                        >
                                            <FiSave className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setEditingNotes(false)}
                                            className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                                        >
                                            <FiX className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setEditingNotes(true)}
                                        className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                                    >
                                        <FiEdit3 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {editingNotes ? (
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Thêm ghi chú về cuộc gọi, phản hồi của khách hàng..."
                                    className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                />
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    {notes || 'Nhấn vào biểu tượng bút để thêm ghi chú...'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailPage;
