import { useState, useRef, useEffect } from 'react';
import { SiZalo, SiMessenger } from 'react-icons/si'; // Using react-icons for Messenger, for Zalo we might need a custom one or SiZalo if available
import { FiMessageCircle, FiX, FiChevronUp } from 'react-icons/fi';

const FloatingContact = () => {
    const [showZaloPopup, setShowZaloPopup] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const popupRef = useRef(null);

    // Toggle Zalo Popup
    const toggleZaloPopup = () => setShowZaloPopup(!showZaloPopup);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowZaloPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Show scroll top button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Replace these with actual links
    const ZALO_LINK = 'https://zalo.me/0935771670';
    const MESSENGER_LINK = 'https://www.facebook.com/Simppolop';

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Scroll to Top */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="w-10 h-10 bg-gray-600/50 hover:bg-gray-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all backdrop-blur-sm mb-2"
                    aria-label="Scroll to top"
                >
                    <FiChevronUp size={20} />
                </button>
            )}

            {/* Zalo Popup */}
            {showZaloPopup && (
                <div
                    ref={popupRef}
                    className="absolute bottom-16 right-0 mb-2 w-72 bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up origin-bottom-right"
                >
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                                <img src="/logo-zalo.png" alt="Zalo" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                                {/* Fallback if no logo */}
                                <span className="text-blue-600 font-bold text-xs">Z</span>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Hộ kinh doanh Nhà BÁN TÁO</p>
                                <p className="text-blue-100 text-xs">Xin chào! Rất vui khi được hỗ trợ bạn</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowZaloPopup(false)}
                            className="text-white/80 hover:text-white"
                        >
                            <FiX size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 bg-gray-50">
                        <p className="text-gray-600 text-sm italic mb-3 text-center">
                            Bắt đầu trò chuyện với Hộ kinh doanh NHÀ BÁN TÁO
                        </p>
                        <div className="space-y-2">
                            <a
                                href={ZALO_LINK}
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-full font-semibold transition-colors shadow-md"
                            >
                                Chat bằng Zalo
                            </a>
                            <button className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-center py-2.5 rounded-full font-medium transition-colors">
                                Chat nhanh
                            </button>
                        </div>
                    </div>

                    {/* Powered by */}
                    <div className="bg-gray-100 py-1 text-center border-t border-gray-200">
                        <span className="text-[10px] text-gray-400">Powered by Zalo</span>
                    </div>
                </div>
            )}

            {/* Messenger Button */}
            <a
                href={MESSENGER_LINK}
                target="_blank"
                rel="noreferrer"
                className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-full shadow-lg shadow-blue-500/30 hover:scale-110 transition-transform duration-300"
                title="Chat Messenger"
            >
                <span className="absolute right-0 top-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500 border-2 border-white"></span>
                </span>
                <svg viewBox="0 0 28 28" className="w-6 h-6 md:w-8 md:h-8 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 0C6.22 0 0 5.56 0 12.55c0 3.75 1.76 7.1 4.6 9.4a.67.67 0 0 0 .28.23l-1.02 3.6a.69.69 0 0 0 .86.84l4.02-1.77a.66.66 0 0 0 .22-.09c1.6.44 3.3.69 5.04.69 7.78 0 14-5.56 14-12.55S21.78 0 14 0zm1.74 16.53-3.08-4.9-6.02 4.9 6.61-7.03 3.1 4.9 6-4.9-6.61 7.03z" />
                </svg>
            </a>

            {/* Zalo Button */}
            <button
                onClick={toggleZaloPopup}
                className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 hover:scale-110 transition-transform duration-300 overflow-hidden"
                title="Chat Zalo"
            >
                <div className="absolute inset-0 bg-blue-600 animate-pulse-slow"></div>
                {/* Zalo Icon SVG */}
                <span className="text-white font-bold text-xl md:text-2xl italic z-10">Zalo</span>
            </button>

        </div>
    );
};

export default FloatingContact;
