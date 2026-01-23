import { useEffect } from 'react';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const Modal = ({ 
  open, 
  onClose, 
  title, 
  children, 
  size = 'md', // sm, md, lg, xl, full
  variant = 'default', // default, success, warning, error, info
  showCloseButton = true,
  closeOnOverlayClick = true,
  showHeader = true,
  footer,
  icon,
  preventClose = false
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose, preventClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  const variantStyles = {
    default: {
      header: 'bg-gradient-to-r from-white to-[#EDF5E1]/50 border-b border-gray-100',
      title: 'text-gray-900',
      iconColor: 'text-[#379683]',
      iconBg: 'bg-gradient-to-r from-[#8EE4AF]/20 to-[#5CDB95]/20',
      iconComponent: FiInfo
    },
    success: {
      header: 'bg-gradient-to-r from-[#EDF5E1] to-[#8EE4AF]/30 border-b border-[#5CDB95]/30',
      title: 'text-[#379683]',
      iconColor: 'text-[#5CDB95]',
      iconBg: 'bg-gradient-to-r from-[#8EE4AF]/30 to-[#5CDB95]/30',
      iconComponent: FiCheckCircle
    },
    warning: {
      header: 'bg-gradient-to-r from-[#EDF5E1] to-[#b8917a]/10 border-b border-[#907163]/30',
      title: 'text-[#907163]',
      iconColor: 'text-[#b8917a]',
      iconBg: 'bg-gradient-to-r from-[#907163]/10 to-[#b8917a]/10',
      iconComponent: FiAlertTriangle
    },
    error: {
      header: 'bg-gradient-to-r from-[#EDF5E1] to-[#f87171]/10 border-b border-[#ef4444]/30',
      title: 'text-[#ef4444]',
      iconColor: 'text-[#f87171]',
      iconBg: 'bg-gradient-to-r from-[#ef4444]/10 to-[#f87171]/10',
      iconComponent: FiAlertCircle
    },
    info: {
      header: 'bg-gradient-to-r from-white to-[#EDF5E1]/50 border-b border-gray-100',
      title: 'text-[#379683]',
      iconColor: 'text-[#5CDB95]',
      iconBg: 'bg-gradient-to-r from-[#8EE4AF]/20 to-[#5CDB95]/20',
      iconComponent: FiInfo
    }
  };

  const style = variantStyles[variant] || variantStyles.default;
  const IconComponent = icon || style.iconComponent;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Overlay with blur */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeOnOverlayClick && !preventClose ? onClose : undefined}
      />

      {/* Modal Container */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl shadow-gray-500/20 w-full mx-auto transform transition-all duration-300 ${
          sizeClasses[size]
        } ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {/* Header */}
        {showHeader && (
          <div className={`${style.header} rounded-t-2xl p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {IconComponent && (
                  <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center shadow-sm`}>
                    <IconComponent className={`w-6 h-6 ${style.iconColor}`} />
                  </div>
                )}
                <div>
                  <h3 className={`text-xl font-bold ${style.title}`}>{title}</h3>
                  {variant !== 'default' && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${style.iconBg}`}></div>
                      <span className="text-sm text-gray-500 capitalize">{variant}</span>
                    </div>
                  )}
                </div>
              </div>

              {showCloseButton && !preventClose && (
                <button
                  onClick={onClose}
                  className="group w-10 h-10 bg-gradient-to-r from-[#EDF5E1] to-white rounded-full flex items-center justify-center hover:shadow-lg hover:scale-110 transition-all duration-300 border border-gray-200"
                  aria-label="Close modal"
                >
                  <FiX className="w-5 h-5 text-gray-600 group-hover:text-[#907163] transition-colors" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`p-6 overflow-y-auto max-h-[calc(90vh-120px)] ${
          !showHeader ? 'rounded-t-2xl' : ''
        }`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="bg-gradient-to-r from-[#EDF5E1]/30 to-white/50 border-t border-gray-100 rounded-b-2xl p-6">
            {footer}
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute -top-3 -right-3">
          <div className="w-6 h-6 bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] rounded-full blur-sm opacity-50"></div>
        </div>
        <div className="absolute -bottom-2 -left-2">
          <div className="w-4 h-4 bg-gradient-to-r from-[#907163] to-[#b8917a] rounded-full blur-sm opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default Modal;