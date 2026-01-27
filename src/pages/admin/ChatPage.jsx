import { useState, useEffect, useRef } from 'react';
import {
    FiMessageCircle,
    FiMail,
    FiUser,
    FiClock,
    FiPhone,
    FiSend,
    FiCheck,
    FiCheckCircle,
    FiLoader,
    FiSearch,
    FiRefreshCw,
    FiMessageSquare,
    FiFilter,
    FiCpu,
    FiInbox,
} from 'react-icons/fi';
import api from '../../services/api';
import { toast } from 'react-toastify';

/**
 * Format time ago
 */
const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 7) return `${diffDays} ngày`;

    return date.toLocaleDateString('vi-VN');
};

/**
 * Admin Chat Page
 */
const ChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [stats, setStats] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    // Fetch conversations
    const fetchConversations = async () => {
        try {
            setLoading(true);
            const response = await api.get('/chat/admin/conversations', {
                params: { status: filter !== 'all' ? filter : undefined }
            });

            if (response.data.success) {
                setConversations(response.data.conversations);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast.error('Lỗi khi tải danh sách chat');
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            const response = await api.get('/chat/admin/stats');
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Fetch messages for a conversation
    const fetchMessages = async (sessionId) => {
        try {
            setMessagesLoading(true);
            const response = await api.get(`/chat/admin/conversation/${sessionId}`);

            if (response.data.success) {
                setMessages(response.data.messages);
                // Update unread count in conversation list
                setConversations(prev => prev.map(c =>
                    c._id === sessionId ? { ...c, unreadCount: 0 } : c
                ));
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Lỗi khi tải tin nhắn');
        } finally {
            setMessagesLoading(false);
        }
    };

    // Send admin reply
    const handleSendReply = async () => {
        if (!replyText.trim() || !selectedSession) return;

        try {
            setSending(true);
            const response = await api.post('/chat/admin/reply', {
                sessionId: selectedSession,
                message: replyText.trim()
            });

            if (response.data.success) {
                setMessages(prev => [...prev, response.data.message]);
                setReplyText('');
                toast.success('Đã gửi tin nhắn');
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            toast.error('Lỗi khi gửi tin nhắn');
        } finally {
            setSending(false);
        }
    };

    // Update conversation status
    const handleUpdateStatus = async (sessionId, status) => {
        try {
            await api.put(`/chat/admin/status/${sessionId}`, { status });
            setConversations(prev => prev.map(c =>
                c._id === sessionId ? { ...c, status } : c
            ));
            toast.success('Đã cập nhật trạng thái');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Lỗi khi cập nhật');
        }
    };

    // Initial load
    useEffect(() => {
        fetchConversations();
        fetchStats();

        // Refresh every 30 seconds
        const interval = setInterval(() => {
            fetchConversations();
            fetchStats();
        }, 30000);

        return () => clearInterval(interval);
    }, [filter]);

    // Load messages when session selected
    useEffect(() => {
        if (selectedSession) {
            fetchMessages(selectedSession);
        }
    }, [selectedSession]);

    // Scroll to bottom when new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Filter conversations by search
    const filteredConversations = conversations.filter(c => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            c.customerInfo?.name?.toLowerCase().includes(search) ||
            c.customerInfo?.phone?.includes(search) ||
            c.customerInfo?.email?.toLowerCase().includes(search) ||
            c.lastMessage?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="bg-white border-b p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FiMessageCircle className="text-blue-500" />
                            Tư vấn khách hàng
                        </h1>
                        <p className="text-gray-500 text-sm">Quản lý và trả lời tin nhắn từ khách hàng</p>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="flex gap-4">
                            <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{stats.totalConversations}</p>
                                <p className="text-xs text-blue-500">Cuộc hội thoại</p>
                            </div>
                            <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{stats.todayConversations}</p>
                                <p className="text-xs text-green-500">Hôm nay</p>
                            </div>
                            <div className="text-center px-4 py-2 bg-red-50 rounded-lg">
                                <p className="text-2xl font-bold text-red-600">{stats.unreadMessages}</p>
                                <p className="text-xs text-red-500">Chưa đọc</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Conversations List */}
                <div className="w-80 bg-white border-r flex flex-col">
                    {/* Search & Filter */}
                    <div className="p-3 border-b space-y-2">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm khách hàng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-1">
                            {['all', 'active', 'pending', 'resolved'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`flex-1 px-2 py-1 text-xs rounded-lg transition-colors ${filter === status
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {status === 'all' ? 'Tất cả' :
                                        status === 'active' ? 'Đang chat' :
                                            status === 'pending' ? 'Chờ xử lý' : 'Đã xong'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conversations */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <FiLoader className="w-6 h-6 animate-spin text-blue-500" />
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FiInbox className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Chưa có cuộc hội thoại nào</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv._id}
                                    onClick={() => setSelectedSession(conv._id)}
                                    className={`w-full p-3 border-b text-left hover:bg-gray-50 transition-colors ${selectedSession === conv._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FiUser className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {conv.customerInfo?.name || conv.customerInfo?.phone || 'Khách ẩn danh'}
                                                </p>
                                                {conv.unreadCount > 0 && (
                                                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">
                                                {conv.lastSender === 'customer' ? '' :
                                                    conv.lastSender === 'ai' ? '🤖 ' : '👤 '}
                                                {conv.lastMessage}
                                            </p>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs text-gray-400">{formatTimeAgo(conv.lastTime)}</span>
                                                <span className={`text-xs px-1.5 py-0.5 rounded ${conv.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        conv.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {conv.status === 'active' ? 'Đang chat' :
                                                        conv.status === 'pending' ? 'Chờ' : 'Xong'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    {selectedSession ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-white border-b p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                        <FiUser className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {conversations.find(c => c._id === selectedSession)?.customerInfo?.name || 'Khách hàng'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {conversations.find(c => c._id === selectedSession)?.customerInfo?.phone || 'Chưa có SĐT'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedSession, 'resolved')}
                                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                                    >
                                        <FiCheckCircle className="inline w-4 h-4 mr-1" />
                                        Đã xử lý
                                    </button>
                                    <button
                                        onClick={() => fetchMessages(selectedSession)}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                    >
                                        <FiRefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messagesLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.sender === 'customer'
                                                        ? 'bg-white border rounded-bl-none'
                                                        : msg.sender === 'ai'
                                                            ? 'bg-purple-100 text-purple-900 rounded-br-none'
                                                            : 'bg-blue-500 text-white rounded-br-none'
                                                    }`}
                                            >
                                                {msg.sender !== 'customer' && (
                                                    <div className="flex items-center gap-1 mb-1 text-xs opacity-70">
                                                        {msg.sender === 'ai' ? (
                                                            <>
                                                                <FiCpu className="w-3 h-3" />
                                                                <span>Trợ lý AI</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiUser className="w-3 h-3" />
                                                                <span>Admin</span>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                                <p className="text-sm whitespace-pre-line">{msg.message}</p>
                                                <p className={`text-xs mt-1 ${msg.sender === 'customer' ? 'text-gray-400' : 'opacity-70'
                                                    }`}>
                                                    {formatTimeAgo(msg.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Reply Input */}
                            <div className="bg-white border-t p-4">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendReply();
                                    }}
                                    className="flex gap-2"
                                >
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Nhập tin nhắn trả lời..."
                                        className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!replyText.trim() || sending}
                                        className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {sending ? (
                                            <FiLoader className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <FiSend className="w-5 h-5" />
                                        )}
                                        Gửi
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <FiMessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium">Chọn một cuộc hội thoại</p>
                                <p className="text-sm">để xem và trả lời tin nhắn khách hàng</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
