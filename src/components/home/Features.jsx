import { FiRefreshCw, FiShield, FiTruck, FiCreditCard, FiGift, FiHeadphones, FiBox, FiStar } from 'react-icons/fi';

const features = [
  {
    icon: FiRefreshCw,
    title: 'HOÀN TRẢ MIỄN PHÍ',
    description: 'Miễn phí trả hàng trong 7 ngày (trừ chính hãng Apple)',
    color: 'text-[#5CDB95]',
    bgColor: 'bg-gradient-to-r from-[#EDF5E1] to-[#8EE4AF]/30',
    gradient: 'from-[#5CDB95] to-[#379683]',
    badge: 'NEW'
  },
  {
    icon: FiShield,
    title: 'CAM KẾT CHÍNH HÃNG',
    description: 'Hoàn tiền gấp đôi nếu phát hiện hàng giả',
    color: 'text-[#379683]',
    bgColor: 'bg-gradient-to-r from-[#EDF5E1] to-[#5CDB95]/20',
    gradient: 'from-[#379683] to-[#5CDB95]',
    badge: '100%'
  },
  {
    icon: FiTruck,
    title: 'FREESHIP TOÀN QUỐC',
    description: 'Freeship cho đơn từ 300K khi thanh toán trước',
    color: 'text-[#8EE4AF]',
    bgColor: 'bg-gradient-to-r from-[#EDF5E1] to-[#8EE4AF]/20',
    gradient: 'from-[#8EE4AF] to-[#5CDB95]',
    badge: 'HOT'
  },
  {
    icon: FiCreditCard,
    title: 'HỖ TRỢ TRẢ GÓP',
    description: 'Trả góp qua thẻ tín dụng & qua app Krevido',
    color: 'text-[#907163]',
    bgColor: 'bg-gradient-to-r from-[#EDF5E1] to-[#907163]/10',
    gradient: 'from-[#907163] to-[#b8917a]',
    badge: '0%'
  },
  {
    icon: FiGift,
    title: 'QUÀ TẶNG HẤP DẪN',
    description: 'Tặng phụ kiện chính hãng cho đơn từ 10 triệu',
    color: 'text-[#379683]',
    bgColor: 'bg-gradient-to-r from-[#EDF5E1] to-[#5CDB95]/20',
    gradient: 'from-[#379683] to-[#907163]',
    badge: 'GIFT'
  },
  {
    icon: FiHeadphones,
    title: 'HỖ TRỢ 24/7',
    description: 'Đội ngũ CSKH hỗ trợ nhiệt tình mọi lúc',
    color: 'text-[#5CDB95]',
    bgColor: 'bg-gradient-to-r from-[#EDF5E1] to-[#8EE4AF]/20',
    gradient: 'from-[#8EE4AF] to-[#5CDB95]',
    badge: '24/7'
  },
  {
    icon: FiBox,
    title: 'GIAO HÀNG SIÊU TỐC',
    description: 'Giao hàng nội thành trong 2h, ngoại thành 24h',
    color: 'text-[#907163]',
    bgColor: 'bg-gradient-to-r from-[#EDF5E1] to-[#907163]/10',
    gradient: 'from-[#907163] to-[#b8917a]',
    badge: '2H'
  },
  {
    icon: FiStar,
    title: 'BẢO HÀNH VÀNG',
    description: 'Bảo hành chính hãng 12 tháng, đổi mới 1 đổi 1',
    color: 'text-[#379683]',
    bgColor: 'bg-gradient-to-r from-[#EDF5E1] to-[#5CDB95]/20',
    gradient: 'from-[#379683] to-[#8EE4AF]',
    badge: 'VIP'
  },
];

const Features = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-[#EDF5E1]/30">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[#379683] to-[#5CDB95] bg-clip-text text-transparent">
              Dịch vụ đẳng cấp
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#379683] via-[#5CDB95] to-[#907163] bg-clip-text text-transparent mb-3">
            Trải nghiệm mua sắm khác biệt
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến cho bạn những dịch vụ tốt nhất khi mua sắm tại NHÀ BÁN TÁO STORE
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-[#8EE4AF]/30 transition-all duration-500 border border-gray-100 hover:border-[#8EE4AF]/30 hover:-translate-y-1"
            >
              {/* Badge */}
              <div className="absolute -top-2 -right-2">
                <span className={`bg-gradient-to-r ${feature.gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                  {feature.badge}
                </span>
              </div>

              {/* Icon Container */}
              <div className="relative mb-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${feature.bgColor} shadow-lg shadow-gray-200/30 group-hover:shadow-xl group-hover:shadow-[#8EE4AF]/20 transition-all duration-300`}>
                  <feature.icon className={`${feature.color} w-8 h-8`} />
                </div>
                
                {/* Animated background effect */}
                <div className={`absolute -inset-2 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-500`}></div>
                
                {/* Pulsing dot */}
                <div className="absolute -top-1 -right-1">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${feature.gradient} animate-pulse`}></div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-[#379683] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Line Indicator */}
              <div className="mt-5 pt-4 border-t border-gray-100 relative">
                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} rounded-full transition-all duration-500 absolute -top-0.5 left-0`}></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Chi tiết</span>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#EDF5E1] to-[#8EE4AF]/20 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-[#8EE4AF] group-hover:to-[#5CDB95] transition-all duration-300">
                    <svg 
                      className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-12 bg-gradient-to-r from-[#EDF5E1] to-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Khách hàng hài lòng', value: '98%', color: 'from-[#8EE4AF] to-[#5CDB95]' },
              { label: 'Sản phẩm chính hãng', value: '100%', color: 'from-[#379683] to-[#5CDB95]' },
              { label: 'Đơn hàng thành công', value: '99.5%', color: 'from-[#907163] to-[#b8917a]' },
              { label: 'Hỗ trợ 24/7', value: '15 phút', color: 'from-[#8EE4AF] to-[#EDF5E1]' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className="h-1 w-16 mx-auto bg-gray-100 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    style={{ width: '90%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#EDF5E1] to-white px-6 py-3 rounded-full border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Bạn cần hỗ trợ?</span>
            </div>
            <button className="px-5 py-2 bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white font-medium rounded-full hover:shadow-lg hover:shadow-[#379683]/30 hover:scale-105 transition-all duration-300">
              Liên hệ ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;