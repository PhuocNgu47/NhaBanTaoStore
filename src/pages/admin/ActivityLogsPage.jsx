import { useState, useEffect } from 'react';
import { activityLogService } from '../../services/activityLogService';
import {
    FiClock,
    FiUser,
    FiActivity,
    FiDatabase,
    FiSearch,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
    FiX,
    FiEye,
    FiArrowRight,
    FiCheck,
    FiAlertCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ActivityLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 1
    });

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        action: '',
        resource: '',
        status: '',
        startDate: '',
        endDate: ''
    });

    // Detail modal
    const [selectedLog, setSelectedLog] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Filter options from API
    const [filterOptions, setFilterOptions] = useState({
        resources: [],
        actions: []
    });

    const fetchLogs = async (page = 1) => {
        try {
            setLoading(true);
            const params = {
                page,
                limit: pagination.limit,
                ...filters
            };

            const response = await activityLogService.getLogs(params);
            if (response.success) {
                setLogs(response.logs);
                setPagination(response.pagination);
                if (response.filters) {
                    setFilterOptions(response.filters);
                }
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            toast.error('Không thể tải lịch sử hoạt động');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(1);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLogs(1);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            action: '',
            resource: '',
            status: '',
            startDate: '',
            endDate: ''
        });
        setTimeout(() => fetchLogs(1), 0);
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleString('vi-VN');
    };

    const getMethodColor = (method) => {
        switch (method) {
            case 'POST': return 'bg-green-100 text-green-800';
            case 'PUT': case 'PATCH': return 'bg-yellow-100 text-yellow-800';
            case 'DELETE': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        return status === 'success'
            ? <FiCheck className="text-green-500" />
            : <FiAlertCircle className="text-red-500" />;
    };

    const openDetailModal = (log) => {
        setSelectedLog(log);
        setShowDetailModal(true);
    };

    // Auth check
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === '123456') {
            setIsAuthenticated(true);
            setAuthError('');
        } else {
            setAuthError('Mật khẩu không đúng');
            setPassword('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiActivity className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Bảo Mật</h2>
                        <p className="text-gray-500 mt-2">Vui lòng nhập mật khẩu để xem nhật ký</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                autoFocus
                            />
                            {authError && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <FiX className="w-4 h-4" /> {authError}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md hover:shadow-lg transform active:scale-[0.98] transition-transform"
                        >
                            Xác thực
                        </button>
                    </form>
                    <p className="text-xs text-center text-gray-400 mt-6">
                        Khu vực dành riêng cho Admin
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FiActivity /> Nhật Ký Hoạt Động
                </h1>
                <p className="text-gray-600">Theo dõi các thay đổi và hoạt động của Admin</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Tên user, hành động..."
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            />
                            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
                        <select
                            name="resource"
                            value={filters.resource}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">Tất cả</option>
                            {filterOptions.resources.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">Tất cả</option>
                            <option value="success">Thành công</option>
                            <option value="failure">Thất bại</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 flex-1 justify-center"
                        >
                            <FiFilter /> Lọc
                        </button>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            title="Xóa bộ lọc"
                        >
                            <FiX />
                        </button>
                    </div>
                </form>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Thời gian</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Người thực hiện</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Hành động</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Đối tượng</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Không tìm thấy hoạt động nào
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50 transition-colors text-sm">
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-600 font-mono text-xs">
                                            {log.formattedTime || formatTime(log.createdAt)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <FiUser className="text-gray-500 w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 text-sm">
                                                        {log.userName || log.user?.name || 'Unknown'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {log.userEmail || log.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(log.method)}`}>
                                                    {log.method}
                                                </span>
                                                <p className="text-gray-700 mt-1 text-sm">
                                                    {log.actionLabel || log.action}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-gray-800 font-medium text-sm">
                                                    {log.resourceName || log.resource}
                                                </p>
                                                <p className="text-xs text-gray-500 font-mono">
                                                    {log.resourceId?.slice(-8) || 'N/A'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                {getStatusIcon(log.status)}
                                                <span className={`text-xs ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {log.status === 'success' ? 'OK' : 'Lỗi'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => openDetailModal(log)}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                <FiEye className="w-4 h-4" />
                                                {log.hasChanges && (
                                                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs">
                                                        {log.changedFieldsCount} thay đổi
                                                    </span>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            Trang {pagination.page} / {pagination.pages} ({pagination.total} logs)
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => fetchLogs(pagination.page - 1)}
                                className={`p-2 rounded-lg border ${pagination.page === 1
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <FiChevronLeft />
                            </button>
                            <button
                                disabled={pagination.page === pagination.pages}
                                onClick={() => fetchLogs(pagination.page + 1)}
                                className={`p-2 rounded-lg border ${pagination.page === pagination.pages
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedLog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FiActivity /> Chi tiết hoạt động
                            </h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Thời gian</p>
                                    <p className="font-medium">{selectedLog.formattedTime || formatTime(selectedLog.createdAt)}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Người thực hiện</p>
                                    <p className="font-medium">{selectedLog.userName || selectedLog.user?.name}</p>
                                    <p className="text-xs text-gray-500">{selectedLog.userEmail || selectedLog.user?.email}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Hành động</p>
                                    <p className="font-medium">{selectedLog.actionLabel || selectedLog.action}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Đối tượng</p>
                                    <p className="font-medium">{selectedLog.resourceName || selectedLog.resource}</p>
                                    <p className="text-xs text-gray-500 font-mono">{selectedLog.resourceId}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">IP Address</p>
                                    <p className="font-mono text-sm">{selectedLog.ip || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(selectedLog.status)}
                                        <span className={selectedLog.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                                            {selectedLog.status === 'success' ? 'Thành công' : 'Thất bại'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Changed Fields */}
                            {selectedLog.changedFields?.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-800 mb-2">Các trường đã thay đổi:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedLog.changedFields.map((field, idx) => (
                                            <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                                {field}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Before / After Data */}
                            {(selectedLog.beforeData || selectedLog.afterData) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedLog.beforeData && (
                                        <div>
                                            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                                Dữ liệu TRƯỚC
                                            </h4>
                                            <pre className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs overflow-auto max-h-60">
                                                {JSON.stringify(selectedLog.beforeData, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                    {selectedLog.afterData && (
                                        <div>
                                            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                                Dữ liệu SAU
                                            </h4>
                                            <pre className="bg-green-50 border border-green-200 p-3 rounded-lg text-xs overflow-auto max-h-60">
                                                {JSON.stringify(selectedLog.afterData, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Details */}
                            {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-medium text-gray-800 mb-2">Chi tiết khác</h4>
                                    <pre className="bg-gray-50 border p-3 rounded-lg text-xs overflow-auto max-h-40">
                                        {JSON.stringify(selectedLog.details, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityLogsPage;
