import { Link } from 'react-router-dom';
import { 
  FiChevronRight, 
  FiTrendingUp, 
  FiZap, 
  FiStar, 
  FiGift,
  FiCalendar,
  FiClock
} from 'react-icons/fi';

const CategoryTabsSection = ({
  title,
  subtitle,
  titleColor = 'white',
  bgColor = 'bg-gradient-to-r from-[#379683] to-[#5CDB95]',
  icon: Icon = FiTrendingUp,
  tabs = [],
  showViewAll = true,
  viewAllLink = '/san-pham',
  variant = 'default', // 'default', 'minimal', 'gradient', 'cards'
  badgeText = '',
  badgeColor = 'from-[#907163] to-[#b8917a]',
  countdown,
}) => {
  const getTabStyles = (variant) => {
    switch(variant) {
      case 'minimal':
        return {
          tab: 'px-4 py-2 text-white/90 hover:text-white hover:bg-white/5 rounded-full text-sm font-medium transition-all duration-300',
          activeTab: 'bg-white/10 text-white border border-white/20',
          container: 'bg-transparent backdrop-blur-sm rounded-2xl border border-white/10 p-1',
        };
      case 'gradient':
        return {
          tab: 'px-5 py-2.5 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent rounded-xl text-sm font-medium transition-all duration-300',
          activeTab: 'bg-gradient-to-r from-white/20 to-transparent text-white shadow-lg',
          container: 'bg-gradient-to-r from-[#379683]/90 to-[#5CDB95]/90 backdrop-blur-md rounded-2xl',
        };
      case 'cards':
        return {
          tab: 'px-5 py-3 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white rounded-xl text-sm font-medium transition-all duration-300 flex flex-col items-center gap-1',
          activeTab: 'bg-gradient-to-r from-[#8EE4AF]/20 to-[#5CDB95]/20 text-white border border-white/30',
          container: 'bg-gradient-to-r from-[#379683] to-[#5CDB95] rounded-2xl relative overflow-hidden',
        };
      default:
        return {
          tab: 'px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-all duration-300',
          activeTab: 'bg-white/20 text-white',
          container: bgColor,
        };
    }
  };

  const styles = getTabStyles(variant);

  // Countdown timer component
  const CountdownTimer = ({ timeLeft }) => {
    if (!timeLeft) return null;
    
    const formatTime = (time) => time.toString().padStart(2, '0');
    
    return (
      <div className="flex items-center gap-4 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
        <div className="flex items-center gap-1 text-white">
          <FiClock className="w-4 h-4" />
          <span className="text-xs font-medium">Kết thúc sau:</span>
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: 'Ngày', value: Math.floor(timeLeft / (1000 * 60 * 60 * 24)) },
            { label: 'Giờ', value: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) },
            { label: 'Phút', value: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)) },
            { label: 'Giây', value: Math.floor((timeLeft % (1000 * 60)) / 1000) },
          ].map((time, index) => (
            <div key={index} className="text-center">
              <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">{formatTime(time.value)}</span>
              </div>
              <span className="text-white/80 text-[10px] mt-1 block">{time.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Background patterns based on variant
  const BackgroundPattern = ({ variant }) => {
    if (variant === 'cards') {
      return (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-white/10 to-transparent rounded-full -translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl"></div>
        </>
      );
    }
    if (variant === 'gradient') {
      return (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`relative rounded-2xl px-6 py-5 ${styles.container} ${variant === 'default' ? bgColor : ''}`}>
      {/* Background Pattern */}
      <BackgroundPattern variant={variant} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              variant === 'cards' ? 'bg-white/20 backdrop-blur-sm' : 'bg-white/10'
            }`}>
              <Icon className={`w-6 h-6 ${
                variant === 'cards' ? 'text-white' : 'text-white/90'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2
                  className={`text-2xl font-bold uppercase ${titleColor === 'white' ? 'text-white' : 'text-gray-900'}`}
                >
                  {title}
                </h2>
                
                {/* Badge */}
                {badgeText && (
                  <span className={`bg-gradient-to-r ${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {badgeText}
                  </span>
                )}
              </div>

              {subtitle && (
                <p className={`text-sm mt-1 ${
                  titleColor === 'white' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* View All */}
          {showViewAll && (
            <Link
              to={viewAllLink}
              className={`flex items-center gap-2 ${
                variant === 'cards' 
                  ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30' 
                  : 'bg-white text-[#379683] hover:bg-gray-50'
              } px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-all duration-300 group`}
            >
              <span>Xem tất cả</span>
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Countdown Timer */}
        {countdown && <CountdownTimer timeLeft={countdown} />}

        {/* Tabs */}
        <div className={`flex items-center gap-2 flex-wrap mt-4 ${
          variant === 'cards' ? 'justify-center' : ''
        }`}>
          {tabs.map((tab, index) => {
            const TabIcon = tab.icon || FiZap;
            const isActive = tab.active || index === 0;
            
            return (
              <Link
                key={index}
                to={tab.link}
                className={`${styles.tab} ${isActive ? styles.activeTab : ''} ${
                  variant === 'cards' ? 'min-w-[100px]' : ''
                } flex items-center gap-2`}
              >
                {tab.icon && (
                  <TabIcon className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-white/70'
                  }`} />
                )}
                <span>{tab.label}</span>
                
                {/* Product count badge */}
                {tab.count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white/30 text-white' 
                      : 'bg-white/10 text-white/70'
                  }`}>
                    {tab.count}
                  </span>
                )}
                
                {/* Special badge for cards variant */}
                {variant === 'cards' && tab.hot && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#907163] to-[#b8917a] rounded-full flex items-center justify-center">
                    <FiZap className="w-2 h-2 text-white" />
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Additional info for cards variant */}
        {variant === 'cards' && (
          <div className="mt-4 flex items-center justify-between text-white/60 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FiStar className="w-4 h-4" />
                <span>Chính hãng Apple</span>
              </div>
              <div className="flex items-center gap-1">
                <FiGift className="w-4 h-4" />
                <span>Quà tặng hấp dẫn</span>
              </div>
              <div className="flex items-center gap-1">
                <FiCalendar className="w-4 h-4" />
                <span>Bảo hành 12 tháng</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTabsSection;