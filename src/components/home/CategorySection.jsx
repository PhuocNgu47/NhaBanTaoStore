import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../constants';
import {
  FiSmartphone, 
  FiTablet, 
  FiMonitor, 
  FiHeadphones, 
  FiWatch, 
  FiMusic, 
  FiHome,
  FiCpu,
  FiBattery,
  FiHardDrive,
  FiTv,
  FiCamera,
  FiPrinter
} from 'react-icons/fi';

import { MdKeyboard, MdMouse } from 'react-icons/md';


const iconMap = {
  smartphone: FiSmartphone,
  tablet: FiTablet,
  laptop: FiMonitor,
  macbook: FiMonitor,
  watch: FiWatch,
  headphones: FiHeadphones,
  airpods: FiHeadphones,
  homepod: FiMusic,
  macmini: FiCpu,
  imac: FiMonitor,
  accessories: MdKeyboard,
  tv: FiTv,
  mouse: MdMouse,
  accessories: MdKeyboard,
  camera: FiCamera,
  printer: FiPrinter,
  ipad: FiTablet,
  iphone: FiSmartphone,
  default: FiCpu,
};

const CategorySection = () => {
  // Category gradient colors
  const categoryGradients = [
    { bg: 'from-[#8EE4AF] to-[#5CDB95]', text: 'text-[#379683]' },
    { bg: 'from-[#5CDB95] to-[#379683]', text: 'text-white' },
    { bg: 'from-[#907163] to-[#b8917a]', text: 'text-white' },
    { bg: 'from-[#379683] to-[#05386B]', text: 'text-white' },
    { bg: 'from-[#8EE4AF] to-[#EDF5E1]', text: 'text-[#379683]' },
    { bg: 'from-[#5CDB95] to-[#8EE4AF]', text: 'text-[#379683]' },
    { bg: 'from-[#907163] to-[#EDF5E1]', text: 'text-[#907163]' },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-white to-[#EDF5E1]/20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[#379683] to-[#5CDB95] bg-clip-text text-transparent">
              Danh mục nổi bật
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#379683] via-[#5CDB95] to-[#907163] bg-clip-text text-transparent mb-3">
            Khám phá thế giới Apple
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chọn danh mục yêu thích và khám phá các sản phẩm Apple chính hãng với ưu đãi đặc biệt
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5">
          {CATEGORIES.map((category, index) => {
            const Icon = iconMap[category.icon] || iconMap.default;
            const gradient = categoryGradients[index % categoryGradients.length];
            const productCount = category.productCount || Math.floor(Math.random() * 50) + 10;
            
            return (
              <Link
                key={category.id}
                to={`/danh-muc/${category.id}`}
                className="group relative bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-[#8EE4AF]/30 transition-all duration-500 border border-gray-100 hover:border-[#8EE4AF]/30 hover:-translate-y-2"
              >
                {/* Gradient Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient.bg} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className="relative mb-4">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${gradient.bg} flex items-center justify-center shadow-lg shadow-gray-400/30 group-hover:shadow-xl group-hover:shadow-[#8EE4AF]/40 transition-all duration-300 group-hover:scale-110`}>
                    <Icon className={`w-10 h-10 ${gradient.text}`} />
                  </div>
                  
                  {/* Animated Ring */}
                  <div className={`absolute -inset-2 rounded-2xl border-2 ${gradient.bg.replace('from-', 'from-').replace('to-', 'to-')} opacity-0 group-hover:opacity-30 blur transition-opacity duration-500`}></div>
                  
                  {/* Pulsing Dot */}
                  <div className="absolute top-2 right-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient.bg} animate-pulse`}></div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className={`font-bold text-gray-800 text-sm mb-1 group-hover:${gradient.text} transition-colors duration-300 line-clamp-1`}>
                    {category.name}
                  </h3>
                  
                  {/* Product Count */}
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-2">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient.bg}`}></div>
                    <span>{productCount} sản phẩm</span>
                  </div>
                  
                  {/* Discount Badge */}
                  {category.discount && (
                    <div className={`inline-block px-2 py-1 rounded-full bg-gradient-to-r ${gradient.bg} text-white text-[10px] font-bold mb-2`}>
                      {category.discount}
                    </div>
                  )}
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${gradient.bg} flex items-center justify-center`}>
                    <svg 
                      className="w-3 h-3 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Categories */}
        <div className="text-center mt-10">
          <Link
            to="/danh-muc"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white px-8 py-3.5 rounded-full font-semibold hover:shadow-xl hover:shadow-[#379683]/40 hover:scale-105 transition-all duration-300"
          >
            <svg 
              className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>Xem tất cả danh mục</span>
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          {/* Quick Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {[
              { label: 'Danh mục', value: CATEGORIES.length, color: 'from-[#8EE4AF] to-[#5CDB95]' },
              { label: 'Sản phẩm', value: '200+', color: 'from-[#379683] to-[#5CDB95]' },
              { label: 'Thương hiệu', value: 'Apple', color: 'from-[#907163] to-[#b8917a]' },
              { label: 'Bảo hành', value: '12 tháng', color: 'from-[#5CDB95] to-[#8EE4AF]' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;