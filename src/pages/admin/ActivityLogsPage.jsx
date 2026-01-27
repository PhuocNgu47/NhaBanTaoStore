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
    FiX
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
        userId: '',
        action: '',
        resource: '',
        startDate: '',
        endDate: ''
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
            userId: '',
            action: '',
            resource: '',
            startDate: '',
            endDate: ''
        });
        // Trigger fetch after state update (might need effect or direct call)
        // Here direct call might use old state, so better wrap fetchLogs
        setTimeout(() => fetchLogs(1), 0);
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleString('vi-VN');
    };

    const getStatusColor = (status) => {
        return status === 'success'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

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
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hành động</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="action"
                                value={filters.action}
                                onChange={handleFilterChange}
                                placeholder="VD: CREATE_PRODUCT"
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
                            <option value="products">Products</option>
                            <option value="orders">Orders</option>
                            <option value="categories">Categories</option>
                            <option value="banners">Banners</option>
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
                                <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Thời gian</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Người thực hiện</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Hành động</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Đối tượng</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">IP Address</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Chi tiết</th>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-mono">
                                            {formatTime(log.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {log.user?.avatar ? (
                                                    <img
                                                        src={log.user.avatar}
                                                        alt={log.user.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <FiUser className="text-gray-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800">{log.user?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">{log.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${log.method === 'POST' ? 'bg-green-100 text-green-800' :
                                                log.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                                                    log.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-800">{log.resource}</div>
                                            <div className="text-xs text-gray-500 font-mono">{log.resourceId}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                            {log.ip}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs overflow-hidden text-ellipsis text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                                                {log.details.message || JSON.stringify(log.details).substring(0, 100)}
                                                {JSON.stringify(log.details).length > 100 && '...'}
                                            </div>
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
                            Trang {pagination.currentPage} / {pagination.pages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.currentPage === 1}
                                onClick={() => fetchLogs(pagination.currentPage - 1)}
                                className={`p-2 rounded-lg border ${pagination.currentPage === 1
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <FiChevronLeft />
                            </button>
                            <button
                                disabled={pagination.currentPage === pagination.pages}
                                onClick={() => fetchLogs(pagination.currentPage + 1)}
                                className={`p-2 rounded-lg border ${pagination.currentPage === pagination.pages
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
        </div>
    );
};

export default ActivityLogsPage;
