import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../constants';
import { FiTablet, FiMonitor, FiHeadphones, FiBox, FiGrid, FiEdit3 } from 'react-icons/fi';

const iconMap = {
  tablet: FiTablet,
  laptop: FiMonitor,
  headphones: FiHeadphones,
  box: FiBox,
  keyboard: FiGrid,
  pen: FiEdit3,
  grid: FiGrid,
};

const CategorySection = () => {
  return (
    <section className="py-8">
      <div className="container-custom">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon] || FiBox;
            return (
              <Link
                key={category.id}
                to={`/danh-muc/${category.id}`}
                className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md hover:border-blue-300 transition-all text-center group"
              >
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                  <Icon className="text-blue-600" size={28} />
                </div>
                <h3 className="font-medium text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
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
