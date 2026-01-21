import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const CategoryTabsSection = ({
  title,
  titleColor = 'white',
  bgColor = 'bg-blue-800',
  tabs = [],
  showViewAll = true,
  viewAllLink = '/san-pham',
}) => {
  return (
    <div className={`${bgColor} rounded-2xl px-6 py-4`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2
          className={`text-xl font-bold uppercase ${
            titleColor === 'white' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {title}
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Tabs */}
          {tabs.map((tab, index) => (
            <Link
              key={index}
              to={tab.link}
              className="px-4 py-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
            >
              {tab.label}
            </Link>
          ))}

          {/* View All */}
          {showViewAll && (
            <Link
              to={viewAllLink}
              className="flex items-center gap-1 bg-white text-blue-800 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Xem tất cả
              <FiChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabsSection;
