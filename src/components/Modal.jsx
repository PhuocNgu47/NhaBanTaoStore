import { useEffect, useRef, useState } from 'react';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

/**
 * Modal Component - Modern & User-friendly
 * 
 * Props:
 * - open: boolean - Hiển thị modal
 * - onClose: function - Callback khi đóng modal
 * - title: string - Tiêu đề modal
 * - subtitle: string - Phụ đề (optional)
 * - icon: 'success' | 'error' | 'warning' | 'info' | ReactNode - Icon hiển thị (optional)
 * - size: 'sm' | 'md' | 'lg' | 'xl' | 'full' - Kích thước modal
 * - children: ReactNode - Nội dung modal
 * - footer: ReactNode - Footer với actions (optional)
 * - closeOnOverlay: boolean - Cho phép đóng khi click overlay (default: true)
 * - showCloseButton: boolean - Hiển thị nút X (default: true)
 */
const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  icon,
  size = 'md',
  children,
  footer,
  closeOnOverlay = true,
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  // Icon components
  const iconComponents = {
    success: <FiCheckCircle className="w-12 h-12 text-green-500" />,
    error: <FiAlertCircle className="w-12 h-12 text-red-500" />,
    warning: <FiAlertTriangle className="w-12 h-12 text-amber-500" />,
    info: <FiInfo className="w-12 h-12 text-blue-500" />,
  };

  // Handle open/close animations
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200); // Match animation duration
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Render icon
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string' && iconComponents[icon]) {
      return (
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-gray-50">
            {iconComponents[icon]}
          </div>
        </div>
      );
    }
    return <div className="flex justify-center mb-4">{icon}</div>;
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
      onClick={handleOverlayClick}
    >
      {/* Backdrop with blur */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full 
          max-h-[90vh] overflow-hidden transform transition-all duration-200 ease-out
          ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
      >
        {/* Close button - floating */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 
              text-gray-500 hover:text-gray-700 transition-all duration-200 hover:rotate-90"
            aria-label="Đóng"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        {(title || icon) && (
          <div className="pt-6 px-6 pb-2">
            {renderIcon()}
            {title && (
              <h3 className="text-xl font-bold text-gray-900 text-center pr-8">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 text-center mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Decorative gradient line */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-6 rounded-full opacity-20" />

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ConfirmModal - Modal xác nhận hành động
 */
export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'warning', // 'warning' | 'danger' | 'info'
  loading = false,
}) => {
  const buttonColors = {
    warning: 'bg-amber-500 hover:bg-amber-600',
    danger: 'bg-red-500 hover:bg-red-600',
    info: 'bg-blue-500 hover:bg-blue-600',
  };

  const iconTypes = {
    warning: 'warning',
    danger: 'error',
    info: 'info',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      icon={iconTypes[type]}
      size="sm"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 
              hover:bg-gray-100 font-medium transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2.5 rounded-xl text-white font-medium 
              transition-all ${buttonColors[type]} disabled:opacity-50
              ${loading ? 'cursor-wait' : ''}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xử lý...
              </span>
            ) : confirmText}
          </button>
        </div>
      }
    >
      <p className="text-gray-600 text-center">{message}</p>
    </Modal>
  );
};

/**
 * AlertModal - Modal thông báo
 */
export const AlertModal = ({
  open,
  onClose,
  title,
  message,
  type = 'info', // 'success' | 'error' | 'warning' | 'info'
  buttonText = 'Đã hiểu',
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      icon={type}
      size="sm"
      footer={
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-medium 
              hover:bg-gray-800 transition-colors"
          >
            {buttonText}
          </button>
        </div>
      }
    >
      <p className="text-gray-600 text-center">{message}</p>
    </Modal>
  );
};

export default Modal;
