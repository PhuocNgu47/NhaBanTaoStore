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
  FiLoader
} from 'react-icons/fi';

// Icon mapping for category icons
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
        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer
          ${level === 0 ? 'font-semibold' : level === 1 ? 'font-medium' : 'font-normal'}
          ${level > 0 ? 'ml-' + (level * 4) : ''}
          ${isActive ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'}
        `}
        style={{ paddingLeft: `${(level * 16) + 12}px` }}
      >
        <Link 
          to={`/danh-muc/${category.slug}`}
          className="flex items-center gap-2 flex-1"
        >
          {level === 0 && (
            <IconComponent className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-gray-500'}`} />
          )}
          <span className={`text-sm ${isActive ? 'text-red-600' : 'text-gray-700'}`}>
            {category.name}
          </span>
        </Link>
        
        {hasChildren && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <FiChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <FiChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        )}
      </div>
      
      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="overflow-hidden">
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

  // Desktop sidebar
  const SidebarContent = () => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FiMenu className="w-5 h-5" />
            Danh mục sản phẩm
          </h3>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <FiLoader className="w-6 h-6 animate-spin text-red-500" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500 text-sm">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            Chưa có danh mục nào
          </div>
        ) : (
          categories.map(category => (
            <CategoryItem 
              key={category._id} 
              category={category}
              activePath={location.pathname}
            />
          ))
        )}
      </div>
    </div>
  );

  // Mobile overlay
  if (onClose) {
    return (
      <>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />
        
        {/* Sidebar */}
        <div 
          className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] z-50 transform transition-transform duration-300 lg:hidden ${
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
