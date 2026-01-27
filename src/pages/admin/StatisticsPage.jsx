import { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar,
    PieChart, Pie, Cell,
    Legend
} from 'recharts';
import {
    FiCalendar, FiDownload, FiDollarSign, FiShoppingBag, FiUsers, FiBox
} from 'react-icons/fi';
import { statisticsService } from '../../services/statisticsService';
import { formatPrice } from '../../utils/helpers';
import { Loading } from '../../components/common';

const StatisticsPage = () => {
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30days');
    const [overview, setOverview] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [orderStats, setOrderStats] = useState([]);
    const [productStats, setProductStats] = useState(null);

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [overviewRes, revenueRes, ordersRes, productsRes] = await Promise.all([
                statisticsService.getOverview(),
                statisticsService.getRevenue(period),
                statisticsService.getOrderStats(),
                statisticsService.getProductStats()
            ]);

            if (overviewRes.success) setOverview(overviewRes.stats);
            if (revenueRes.success) setRevenueData(revenueRes.data?.data || []);
            if (ordersRes.success) setOrderStats(ordersRes.data || []);
            if (productsRes.success) setProductStats(productsRes.data);
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    // Format date for charts
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    if (loading && !overview) {
        return <Loading fullScreen={false} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Thống kê & Báo cáo</h1>
                    <p className="text-gray-500">Phân tích chi tiết hoạt động kinh doanh</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-white border rounded-lg p-1 flex">
                        <button
                            onClick={() => setPeriod('7days')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${period === '7days' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            7 ngày
                        </button>
                        <button
                            onClick={() => setPeriod('30days')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${period === '30days' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            30 ngày
                        </button>
                        <button
                            onClick={() => setPeriod('90days')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${period === '90days' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            3 tháng
                        </button>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-gray-600 hover:bg-gray-50">
                        <FiDownload className="w-4 h-4" />
                        <span className="hidden sm:inline">Xuất báo cáo</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tổng doanh thu</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {formatPrice(overview?.totalRevenue || 0)}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <FiDollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-500 font-medium flex items-center">
                            +{overview?.revenueGrowth || 0}%
                        </span>
                        <span className="text-gray-400 ml-2">so với kỳ trước</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {overview?.totalOrders || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <FiShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-500 font-medium flex items-center">
                            +12.5%
                        </span>
                        <span className="text-gray-400 ml-2">so với kỳ trước</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Khách hàng mới</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {overview?.totalUsers || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                            <FiUsers className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-500 font-medium flex items-center">
                            +{overview?.newUsersThisMonth || 0}
                        </span>
                        <span className="text-gray-400 ml-2">trong tháng này</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Sản phẩm bán ra</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {productStats?.totalSold || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <FiBox className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Biểu đồ doanh thu</h2>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="_id"
                                    tickFormatter={formatDate}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    tickFormatter={(value) => `${value / 1000000}M`}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dx={-10}
                                />
                                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                                <Tooltip
                                    formatter={(value) => [formatPrice(value), 'Doanh thu']}
                                    labelFormatter={(label) => `Ngày ${formatDate(label)}`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Trạng thái đơn hàng</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {orderStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {orderStats.map((stat, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: stat.color || COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-gray-600">{stat.label}</span>
                                </div>
                                <span className="font-medium text-gray-800">{stat.count} đơn</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Sản phẩm bán chạy nhất</h2>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={productStats?.topProducts?.slice(0, 10) || []}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="productName"
                                width={150}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                formatter={(value) => [value, 'Đã bán']}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="totalSold" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                {productStats?.topProducts?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
