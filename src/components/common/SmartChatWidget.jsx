import { useState, useRef, useEffect } from 'react';
import {
    FiMessageCircle,
    FiX,
    FiSend,
    FiCpu,
    FiHelpCircle,
    FiClock,
    FiPhone,
    FiShield,
    FiDollarSign,
    FiTruck,
    FiUser,
    FiChevronLeft,
    FiLoader,
} from 'react-icons/fi';
import api from '../../services/api';

// AI-generated suggested questions based on common customer inquiries
const SUGGESTED_QUESTIONS = [
    {
        id: 1,
        icon: FiClock,
        question: 'Shop mở cửa từ mấy giờ?',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        id: 2,
        icon: FiShield,
        question: 'iPhone cũ bảo hành bao lâu?',
        color: 'from-green-500 to-emerald-500',
    },
    {
        id: 3,
        icon: FiDollarSign,
        question: 'Có hỗ trợ trả góp không?',
        color: 'from-orange-500 to-amber-500',
    },
    {
        id: 4,
        icon: FiTruck,
        question: 'Giao hàng mất bao lâu?',
        color: 'from-purple-500 to-violet-500',
    },
    {
        id: 5,
        icon: FiPhone,
        question: 'Liên hệ hotline mấy giờ?',
        color: 'from-red-500 to-pink-500',
    },
    {
        id: 6,
        icon: FiHelpCircle,
        question: 'Chính sách đổi trả như nào?',
        color: 'from-indigo-500 to-blue-500',
    },
];

// Pre-defined AI responses (can be enhanced with actual AI API calls)
const AI_RESPONSES = {
    'Shop mở cửa từ mấy giờ?': `🕐 **Giờ mở cửa Nhà Bán Táo:**

• Thứ 2 - Thứ 6: **8:00 - 21:00**
• Thứ 7 - CN: **9:00 - 20:00**

📍 Địa chỉ: 123 Nguyễn Huệ, Q.1, TP.HCM

Bạn có thể ghé thăm trực tiếp hoặc đặt hàng online 24/7!`,

    'iPhone cũ bảo hành bao lâu?': `📱 **Chính sách bảo hành iPhone:**

• **iPhone Openbox/CPO:** Bảo hành **12 tháng** 1 đổi 1
• **iPhone Nguyên Seal:** Bảo hành **24 tháng** chính hãng Apple
• **Phụ kiện:** Bảo hành **3-6 tháng**

✨ Đặc biệt: Đổi trả miễn phí trong **7 ngày** nếu không hài lòng!`,

    'Có hỗ trợ trả góp không?': `💳 **Hỗ trợ trả góp linh hoạt:**

• Trả góp **0% lãi suất** qua thẻ tín dụng
• Trả góp qua công ty tài chính (6-24 tháng)
• Chỉ cần **CMND/CCCD** + hóa đơn điện/nước

💰 Thanh toán: Tiền mặt, chuyển khoản, ví điện tử (MoMo, ZaloPay)`,

    'Giao hàng mất bao lâu?': `🚚 **Thời gian giao hàng:**

• **Nội thành TP.HCM:** 2-4 giờ (Ship Express)
• **Các tỉnh lân cận:** 1-2 ngày
• **Toàn quốc:** 2-5 ngày

🎁 **FREESHIP** toàn quốc với đơn từ **2 triệu đồng**!`,

    'Liên hệ hotline mấy giờ?': `📞 **Hotline hỗ trợ:**

• Số điện thoại: **0935 771 670**
• Zalo: Chat qua Zalo 24/7
• Facebook: Messenger @NhaBanTao

⏰ Tổng đài hoạt động: **8:00 - 22:00** hàng ngày`,

    'Chính sách đổi trả như nào?': `🔄 **Chính sách đổi trả:**

• **Đổi trả miễn phí** trong 7 ngày đầu
• **1 đổi 1** nếu lỗi do nhà sản xuất
• **Hoàn tiền 100%** nếu sản phẩm không đúng mô tả

📋 Điều kiện: Sản phẩm còn nguyên hộp, phụ kiện đầy đủ`,
};

/**
 * Chat Message Component
 */
const ChatMessage = ({ message, isUser }) => (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 ${isUser
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}
        >
            {!isUser && (
                <div className="flex items-center gap-2 mb-1">
                    <FiCpu className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-blue-600">Trợ lý AI</span>
                </div>
            )}
            <div className="text-sm whitespace-pre-line leading-relaxed">
                {message.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
            </div>
        </div>
    </div>
);

/**
 * Smart Chat Widget Component
 */
const SmartChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [sessionId] = useState(() => {
        // Get or create unique session ID for this chat
        let id = sessionStorage.getItem('chatSessionId');
        if (!id) {
            id = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('chatSessionId', id);
        }
        return id;
    });
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom when new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle question click
    const handleQuestionClick = async (question) => {
        setShowSuggestions(false);
        setMessages((prev) => [...prev, { text: question, isUser: true }]);
        setIsTyping(true);

        try {
            // Send to backend and save to database
            const response = await api.post('/chat/send', {
                sessionId,
                guestId: localStorage.getItem('guestId'),
                message: question,
                customerInfo: {
                    name: localStorage.getItem('customerName') || null,
                    phone: localStorage.getItem('customerPhone') || null,
                }
            });

            if (response.data.success) {
                setMessages((prev) => [...prev, { text: response.data.reply, isUser: false }]);
            } else {
                throw new Error('Failed');
            }
        } catch (error) {
            // Fallback to pre-defined responses
            const fallbackResponse = AI_RESPONSES[question] || 'Xin lỗi, có lỗi xảy ra. Vui lòng liên hệ hotline 0935 771 670!';
            setMessages((prev) => [...prev, { text: fallbackResponse, isUser: false }]);
        }

        setIsTyping(false);
    };

    // Handle free text input
    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setShowSuggestions(false);
        setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
        setIsTyping(true);

        try {
            // Send to backend and save to database for admin to see
            const response = await api.post('/chat/send', {
                sessionId,
                guestId: localStorage.getItem('guestId'),
                message: userMessage,
                customerInfo: {
                    name: localStorage.getItem('customerName') || null,
                    phone: localStorage.getItem('customerPhone') || null,
                },
                metadata: {
                    page: window.location.pathname
                }
            });

            if (response.data.success) {
                setMessages((prev) => [...prev, { text: response.data.reply, isUser: false }]);
            } else {
                throw new Error('AI response failed');
            }
        } catch (error) {
            // Fallback response
            await new Promise((resolve) => setTimeout(resolve, 500));

            const fallbackResponse = `Cảm ơn bạn đã liên hệ! 🙏

Câu hỏi của bạn đã được ghi nhận. Nhân viên tư vấn sẽ phản hồi sớm nhất!

📞 Hotline: **0935 771 670**
💬 Zalo: **zalo.me/0935771670**`;

            setMessages((prev) => [...prev, { text: fallbackResponse, isUser: false }]);
        }

        setIsTyping(false);
    };

    // Reset chat
    const handleReset = () => {
        setMessages([]);
        setShowSuggestions(true);
    };

    return (
        <>
            {/* Chat Widget Container */}
            <div
                className={`fixed bottom-24 right-6 z-50 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <FiCpu className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Trợ lý AI Nhà Bán Táo</h3>
                                    <p className="text-blue-100 text-xs flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        Đang hoạt động
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white p-1"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Body */}
                    <div className="h-80 overflow-y-auto p-4 bg-gray-50">
                        {/* Welcome message */}
                        {messages.length === 0 && (
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FiMessageCircle className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="font-bold text-gray-800 mb-1">Xin chào! 👋</h4>
                                <p className="text-sm text-gray-600">
                                    Tôi là trợ lý AI của Nhà Bán Táo. Bạn cần hỗ trợ gì?
                                </p>
                            </div>
                        )}

                        {/* Suggested Questions */}
                        {showSuggestions && messages.length === 0 && (
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 font-medium mb-2">Câu hỏi thường gặp:</p>
                                {SUGGESTED_QUESTIONS.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleQuestionClick(item.question)}
                                            className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-left group"
                                        >
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm text-gray-700 group-hover:text-blue-600">
                                                {item.question}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Messages */}
                        {messages.map((msg, idx) => (
                            <ChatMessage key={idx} message={msg.text} isUser={msg.isUser} />
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start mb-3">
                                <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-md">
                                    <div className="flex items-center gap-2">
                                        <FiLoader className="w-4 h-4 text-blue-500 animate-spin" />
                                        <span className="text-sm text-gray-500">Đang trả lời...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Back to suggestions */}
                        {messages.length > 0 && !showSuggestions && (
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mx-auto mt-2"
                            >
                                <FiChevronLeft className="w-3 h-3" />
                                Xem câu hỏi khác
                            </button>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Footer */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Nhập câu hỏi của bạn..."
                                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isTyping}
                                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiSend className="w-4 h-4" />
                            </button>
                        </form>
                        <p className="text-[10px] text-gray-400 text-center mt-2">
                            Powered by AI • Nhà Bán Táo
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen
                    ? 'bg-gray-600 hover:bg-gray-700 rotate-90'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-110'
                    }`}
            >
                {isOpen ? (
                    <FiX className="w-6 h-6 text-white" />
                ) : (
                    <>
                        <FiMessageCircle className="w-7 h-7 text-white" />
                        {/* Notification dot */}
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white text-[8px] text-white font-bold items-center justify-center">
                                AI
                            </span>
                        </span>
                    </>
                )}
            </button>
        </>
    );
};

export default SmartChatWidget;
