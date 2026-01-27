import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { FiTablet, FiMonitor, FiHeadphones, FiBox, FiGrid, FiEdit3, FiSmartphone, FiWatch, FiPackage, FiLoader } from 'react-icons/fi';

const iconMap = {
  tablet: FiTablet,
  laptop: FiMonitor,
  headphones: FiHeadphones,
  box: FiBox,
  keyboard: FiGrid,
  pen: FiEdit3,
  grid: FiGrid,
  smartphone: FiSmartphone,
  watch: FiWatch,
  package: FiPackage,
};

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getMenuCategories();
        if (response.success && response.menu) {
          // Chỉ lấy các category cấp 1 (parent categories)
          setCategories(response.menu.filter(cat => !cat.parent || cat.level === 0).slice(0, 7));
        }
      } catch (err) {
        // Không log lỗi để tránh spam console
        console.error('Error fetching categories for home:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-8">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh mục sản phẩm</h2>
          <div className="flex items-center justify-center py-8">
            <FiLoader className="w-8 h-8 animate-spin text-red-500" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container-custom">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map((category) => {
            // Map icon từ category.icon hoặc dùng default
            const Icon = iconMap[category.icon] || FiPackage;
            return (
              <Link
                key={category._id}
                to={`/danh-muc/${category.slug}`}
                className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md hover:border-red-300 transition-all text-center group"
              >
                <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-100 transition-colors">
                  <Icon className="text-red-600" size={28} />
                </div>
                <h3 className="font-medium text-gray-800 text-sm group-hover:text-red-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
