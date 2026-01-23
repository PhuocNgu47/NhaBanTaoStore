import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { 
  FiChevronRight, 
  FiChevronDown,
  FiSmartphone,
  FiTablet,
  FiMonitor,
  FiWatch,
  FiHeadphones,
  FiPackage,
  FiX,
  FiMenu,
  FiLoader,
  FiFilter,
  FiLayers,
  FiGrid
} from 'react-icons/fi';

// Icon mapping for category icons - updated with gradient colors
const ICON_MAP = {
  FiSmartphone,
  FiTablet, 
  FiMonitor,
  FiWatch,
  FiHeadphones,
  FiPackage,
};

const CategoryItem = ({ category, level = 0, activePath }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isActive = activePath === `/danh-muc/${category.slug}`;
  
  // Get gradient colors based on level
  const getLevelColors = () => {
    switch(level) {
      case 0:
        return {
          bg: isActive ? 'bg-gradient-to-r from-[#EDF5E1] to-[#8EE4AF]/30' : 'hover:bg-gradient-to-r hover:from-[#EDF5E1]/50 hover:to-[#8EE4AF]/10',
          text: isActive ? 'text-[#379683]' : 'text-gray-800',
          icon: isActive ? 'text-[#379683]' : 'text-gray-600',
          border: isActive ? 'border-l-4 border-[#5CDB95]' : '',
          activeDot: isActive ? 'bg-gradient-to-r from-[#379683] to-[#5CDB95]' : ''
        };
      case 1:
        return {
          bg: isActive ? 'bg-gradient-to-r from-[#EDF5E1] to-[#8EE4AF]/20' : 'hover:bg-gradient-to-r hover:from-[#EDF5E1]/30 hover:to-[#8EE4AF]/5',
          text: isActive ? 'text-[#5CDB95]' : 'text-gray-700',
          icon: isActive ? 'text-[#5CDB95]' : 'text-gray-500',
          border: isActive ? 'border-l-4 border-[#8EE4AF]' : '',
          activeDot: isActive ? 'bg-gradient-to-r from-[#5CDB95] to-[#8EE4AF]' : ''
        };
      default:
        return {
          bg: isActive ? 'bg-gradient-to-r from-[#EDF5E1] to-[#EDF5E1]/50' : 'hover:bg-gradient-to-r hover:from-[#EDF5E1]/20 hover:to-transparent',
          text: isActive ? 'text-[#907163]' : 'text-gray-600',
          icon: isActive ? 'text-[#907163]' : 'text-gray-400',
          border: isActive ? 'border-l-4 border-[#907163]' : '',
          activeDot: isActive ? 'bg-gradient-to-r from-[#907163] to-[#b8917a]' : ''
        };
    }
  };

  const colors = getLevelColors();
  
  // Auto expand if this category or its children is active
  useEffect(() => {
    if (isActive) {
      setIsExpanded(true);
    }
    if (hasChildren && category.children.some(child => 
      activePath === `/danh-muc/${child.slug}` ||
      (child.children && child.children.some(grandchild => 
        activePath === `/danh-muc/${grandchild.slug}`
      ))
    )) {
      setIsExpanded(true);
    }
  }, [activePath, category, hasChildren, isActive]);

  const IconComponent = ICON_MAP[category.icon] || FiPackage;

  return (
    <div className="w-full">
      <div 
        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer
          ${colors.bg} ${colors.border}
          ${level === 0 ? 'font-semibold' : level === 1 ? 'font-medium' : 'font-normal'}
        `}
        style={{ paddingLeft: `${(level * 16) + 16}px` }}
      >
        <Link 
          to={`/danh-muc/${category.slug}`}
          className="flex items-center gap-3 flex-1 group"
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
        >
          {/* Active indicator dot */}
          {isActive && (
            <div className={`absolute left-0 w-1 h-6 rounded-r-full ${colors.activeDot}`}></div>
          )}
          
          {/* Icon with gradient background for level 0 */}
          {level === 0 && (
            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center
              ${isActive ? 'bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95]' : 'bg-[#EDF5E1] group-hover:bg-gradient-to-r group-hover:from-[#8EE4AF]/20 group-hover:to-[#5CDB95]/20'}`}>
              <IconComponent className={`w-5 h-5 ${colors.icon} ${isActive ? 'text-white' : ''}`} />
              {/* Icon glow effect */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] opacity-20 blur-sm rounded-xl"></div>
              )}
            </div>
          )}
          
          {/* For deeper levels, show smaller icon or just dot */}
          {level >= 1 && (
            <div className="flex items-center gap-2">
              {isActive ? (
                <div className={`w-2 h-2 rounded-full ${colors.activeDot}`}></div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
              )}
              {level === 1 && (
                <IconComponent className={`w-4 h-4 ${colors.icon}`} />
              )}
            </div>
          )}
          
          {/* Category name */}
          <div className="flex flex-col">
            <span className={`text-sm ${colors.text}`}>
              {category.name}
            </span>
            
            {/* Show product count if available */}
            {category.productCount !== undefined && (
              <span className={`text-xs ${isActive ? 'text-[#379683]/70' : 'text-gray-400'}`}>
                {category.productCount} sản phẩm
              </span>
            )}
          </div>
        </Link>
        
        {/* Expand/collapse button */}
        {hasChildren && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={`p-2 rounded-lg transition-all duration-300 group/btn
              ${isActive ? 'bg-white/30' : 'bg-transparent hover:bg-[#EDF5E1]'}`}
          >
            {isExpanded ? (
              <FiChevronDown className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover/btn:text-[#379683]'}`} />
            ) : (
              <FiChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover/btn:text-[#379683]'}`} />
            )}
          </button>
        )}
      </div>
      
      {/* Children with fade-in animation */}
      {hasChildren && isExpanded && (
        <div className="overflow-hidden animate-fadeIn">
          {category.children.map(child => (
            <CategoryItem 
              key={child._id} 
              category={child} 
              level={level + 1}
              activePath={activePath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategorySidebar = ({ isOpen, onClose, className = '' }) => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getMenuCategories();
        if (response.success) {
          setCategories(response.menu || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Không thể tải danh mục');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = searchTerm 
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.children && cat.children.some(child => 
          child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (child.children && child.children.some(grandchild => 
            grandchild.name.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        ))
      )
    : categories;

  // Desktop sidebar
  const SidebarContent = () => (
    <div className={`bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 ${className}`}>
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-[#EDF5E1]/50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] flex items-center justify-center shadow-lg shadow-[#8EE4AF]/30">
              <FiGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                Danh mục sản phẩm
              </h3>
              <p className="text-xs text-gray-500">Chọn danh mục để xem sản phẩm</p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-[#EDF5E1] rounded-xl transition-all duration-300 hover:scale-110"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Search input */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8EE4AF] focus:border-[#5CDB95] transition-all duration-300 placeholder:text-gray-400 text-gray-700 shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <FiFilter className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="p-3 max-h-[calc(100vh-250px)] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[#EDF5E1] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] opacity-20 blur-md"></div>
            </div>
            <span className="text-sm text-gray-500">Đang tải danh mục...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#EDF5E1] to-[#EDF5E1]/50 rounded-full flex items-center justify-center mb-4">
              <FiLayers className="w-8 h-8 text-[#907163]" />
            </div>
            <p className="text-red-500 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-[#EDF5E1] to-[#8EE4AF]/30 text-gray-700 rounded-lg hover:shadow-md transition-all duration-300 text-sm"
            >
              Thử lại
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#EDF5E1] to-[#EDF5E1]/50 rounded-full flex items-center justify-center mb-4">
              <FiPackage className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              {searchTerm ? `Không tìm thấy danh mục "${searchTerm}"` : 'Chưa có danh mục nào'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-[#EDF5E1] to-[#8EE4AF]/30 text-[#379683] rounded-lg hover:shadow-md transition-all duration-300 text-sm"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredCategories.map(category => (
              <CategoryItem 
                key={category._id} 
                category={category}
                activePath={location.pathname}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-[#EDF5E1]/30 to-transparent">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95]"></div>
            <span>{filteredCategories.length} danh mục</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#907163] to-[#b8917a]"></div>
            <span>Đã chọn: {location.pathname.includes('/danh-muc/') ? '1' : '0'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile overlay
  if (onClose) {
    return (
      <>
        {/* Overlay with blur effect */}
        <div 
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />
        
        {/* Sidebar with slide animation */}
        <div 
          className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] z-50 transform transition-all duration-300 lg:hidden ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent />
        </div>
      </>
    );
  }

  // Desktop static sidebar
  return <SidebarContent />;
};

export default CategorySidebar;