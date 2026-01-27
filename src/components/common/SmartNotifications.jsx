import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGift,
    FiX,
    FiPercent,
    FiShoppingCart,
    FiTrendingUp,
    FiClock,
    FiStar,
    FiHeart,
    FiZap,
    FiCopy,
    FiCheck,
} from 'react-icons/fi';

// Vietnamese names for social proof
const VIETNAMESE_NAMES = [
    'Anh Minh', 'Chị Hương', 'Anh Tuấn', 'Chị Lan', 'Anh Nam',
    'Chị Mai', 'Anh Đức', 'Chị Linh', 'Anh Phong', 'Chị Thảo',
    'Anh Hoàng', 'Chị Ngọc', 'Anh Khoa', 'Chị Hà', 'Anh Bình',
    'Chị Yến', 'Anh Long', 'Chị Trang', 'Anh Việt', 'Chị Oanh',
];

// Cities for location
const CITIES = [
    'Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'Nha Trang', 'Huế', 'Biên Hòa', 'Vũng Tàu', 'Bắc Ninh',
];

// Products for social proof
const SAMPLE_PRODUCTS = [
    'iPhone 15 Pro Max', 'MacBook Pro M3', 'iPad Pro 12.9"',
    'Apple Watch Ultra 2', 'AirPods Pro 2', 'iMac 24"',
    'Mac Mini M2', 'Apple TV 4K', 'HomePod mini',
];

// Actions for social proof
const ACTIONS = [
    { text: 'vừa thêm vào giỏ hàng', icon: FiShoppingCart, color: 'text-green-500' },
    { text: 'vừa mua', icon: FiCheck, color: 'text-blue-500' },
    { text: 'đang xem', icon: FiTrendingUp, color: 'text-purple-500' },
];

/**
 * Generate random social proof notification
 */
const generateSocialProof = () => {
    const name = VIETNAMESE_NAMES[Math.floor(Math.random() * VIETNAMESE_NAMES.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const product = SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const timeAgo = Math.floor(Math.random() * 10) + 1;

    return {
        id: Date.now(),
        type: 'social_proof',
        name,
        city,
        product,
        action,
        timeAgo: timeAgo + ' phút trước',
    };
};

/**
 * Single Notification Component
 */
const NotificationCard = ({ notification, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Social Proof Notification
    if (notification.type === 'social_proof') {
        const ActionIcon = notification.action.icon;
        return (
            <motion.div
                initial={{ opacity: 0, x: -100, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 max-w-xs"
            >
                <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0`}>
                        <ActionIcon className={`w-5 h-5 ${notification.action.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">
                            <span className="font-semibold">{notification.name}</span> từ{' '}
                            <span className="text-gray-600">{notification.city}</span>{' '}
                            {notification.action.text}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1 truncate">
                            {notification.product}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {notification.timeAgo}
                        </p>
                    </div>
                    <button
                        onClick={() => onClose(notification.id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        );
    }

    // Discount Offer Notification
    if (notification.type === 'discount_offer') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-xl p-5 max-w-sm text-white"
            >
                <button
                    onClick={() => onClose(notification.id)}
                    className="absolute top-2 right-2 text-white/70 hover:text-white"
                >
                    <FiX className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-3">
                    <FiGift className="w-6 h-6" />
                    <span className="font-bold text-lg">{notification.title}</span>
                </div>

                <p className="text-white/90 text-sm mb-4">{notification.message}</p>

                {notification.code && (
                    <div className="bg-white/20 rounded-lg p-3 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-white/70">Mã giảm giá</p>
                            <p className="text-lg font-bold tracking-wider">{notification.code}</p>
                        </div>
                        <button
                            onClick={() => handleCopyCode(notification.code)}
                            className="bg-white text-orange-600 px-3 py-2 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors flex items-center gap-1"
                        >
                            {copied ? (
                                <>
                                    <FiCheck className="w-4 h-4" />
                                    Đã sao chép
                                </>
                            ) : (
                                <>
                                    <FiCopy className="w-4 h-4" />
                                    Sao chép
                                </>
                            )}
                        </button>
                    </div>
                )}

                {notification.discount && (
                    <div className="mt-3 text-center">
                        <span className="text-4xl font-bold">{notification.discount}%</span>
                        <span className="text-lg ml-1">OFF</span>
                    </div>
                )}
            </motion.div>
        );
    }

    // First Time Visitor
    if (notification.type === 'first_time') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-xl p-5 max-w-sm text-white relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <button
                    onClick={() => onClose(notification.id)}
                    className="absolute top-2 right-2 text-white/70 hover:text-white z-10"
                >
                    <FiX className="w-5 h-5" />
                </button>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <FiStar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold">Chào mừng bạn mới!</p>
                            <p className="text-sm text-purple-200">Ưu đãi dành riêng cho bạn</p>
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                        <p className="text-sm text-purple-100 mb-2">Mã giảm giá đơn hàng đầu tiên</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold tracking-wider">{notification.code}</p>
                            <button
                                onClick={() => handleCopyCode(notification.code)}
                                className="bg-white text-purple-600 px-3 py-1.5 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors"
                            >
                                {copied ? 'Đã sao chép!' : 'Lấy mã'}
                            </button>
                        </div>
                    </div>

                    <p className="text-sm text-purple-200 text-center">
                        Giảm ngay <span className="font-bold text-white">{notification.discount}%</span> cho đơn hàng đầu tiên
                    </p>
                </div>
            </motion.div>
        );
    }

    // Category Interest
    if (notification.type === 'category_interest') {
        return (
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 max-w-sm"
            >
                <button
                    onClick={() => onClose(notification.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    <FiX className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiZap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

                        {notification.code && (
                            <div className="mt-3 bg-blue-50 rounded-lg p-2 flex items-center justify-between">
                                <span className="font-mono font-bold text-blue-700">{notification.code}</span>
                                <button
                                    onClick={() => handleCopyCode(notification.code)}
                                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                                >
                                    {copied ? 'Đã lấy!' : 'Lấy mã'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    // Trending Alert
    if (notification.type === 'trending') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-4 max-w-xs text-white"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                        <FiTrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-semibold flex items-center gap-1">
                            <FiHeart className="w-4 h-4" />
                            {notification.viewers} người đang xem
                        </p>
                        <p className="text-sm text-yellow-100">sản phẩm này</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return null;
};

/**
 * Main Smart Notifications Component
 */
const SmartNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [shownFirstTime, setShownFirstTime] = useState(false);

    // Check first visit
    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisitedBefore');
        if (!hasVisited) {
            setIsFirstVisit(true);
            localStorage.setItem('hasVisitedBefore', 'true');
        }
    }, []);

    // Show first time visitor popup
    useEffect(() => {
        if (isFirstVisit && !shownFirstTime) {
            const timer = setTimeout(() => {
                setNotifications(prev => [...prev, {
                    id: Date.now(),
                    type: 'first_time',
                    code: 'WELCOME10',
                    discount: 10,
                }]);
                setShownFirstTime(true);
            }, 3000); // Show after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [isFirstVisit, shownFirstTime]);

    // Social proof notifications (random interval)
    useEffect(() => {
        const showSocialProof = () => {
            // Only show if less than 3 notifications
            if (notifications.length < 3) {
                const proof = generateSocialProof();
                setNotifications(prev => [...prev.slice(-2), proof]); // Keep max 3

                // Auto-remove after 5 seconds
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== proof.id));
                }, 5000);
            }
        };

        // Initial delay before first social proof
        const initialDelay = setTimeout(() => {
            showSocialProof();
        }, 8000);

        // Random interval between 15-30 seconds
        const interval = setInterval(() => {
            showSocialProof();
        }, Math.random() * 15000 + 15000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, []);

    // Check for category interest (based on viewed products)
    useEffect(() => {
        const checkCategoryInterest = () => {
            const viewedCategories = JSON.parse(localStorage.getItem('viewedCategories') || '{}');
            const topCategory = Object.entries(viewedCategories)
                .sort(([, a], [, b]) => b - a)[0];

            if (topCategory && topCategory[1] >= 3 && !localStorage.getItem(`shown_category_${topCategory[0]}`)) {
                // Show category discount after viewing 3+ products in same category
                setNotifications(prev => [...prev, {
                    id: Date.now(),
                    type: 'category_interest',
                    title: `Ưu đãi ${topCategory[0]}!`,
                    message: `Bạn đang quan tâm đến ${topCategory[0]}? Nhận ngay giảm giá 5% cho danh mục này!`,
                    code: `${topCategory[0].toUpperCase().replace(/\s/g, '')}5`,
                }]);

                localStorage.setItem(`shown_category_${topCategory[0]}`, 'true');
            }
        };

        // Check every 30 seconds
        const interval = setInterval(checkCategoryInterest, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close notification
    const handleClose = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <div className="fixed left-4 bottom-20 z-50 space-y-3">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onClose={handleClose}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default SmartNotifications;
