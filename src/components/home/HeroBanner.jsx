import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronRight, FiPlay, FiShoppingBag, FiGift, FiStar, FiUsers, FiPackage } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920&auto=format&fit=crop',
    title: 'NHÀ BÁN TÁO STORE',
    subtitle: 'TRẢI NGHIỆM APPLE CHÍNH HÃNG',
    description: 'Cửa hàng ủy quyền Apple chính thức - Nơi hội tụ đam mê công nghệ',
    cta: 'Khám phá ngay',
    link: '/san-pham',
    bgColor: 'bg-gradient-to-r from-[#379683]/80 via-[#5CDB95]/70 to-[#8EE4AF]/60',
    stats: [
      { label: 'Sản phẩm', value: '200+', icon: FiPackage },
      { label: 'Khách hàng', value: '10K+', icon: FiUsers },
      { label: 'Đánh giá', value: '4.9★', icon: FiStar },
    ]
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&auto=format&fit=crop',
    title: 'WORK FROM ANYWHERE',
    subtitle: 'BỘ ĐÔI HOÀN HẢO CHO CÔNG VIỆC',
    description: 'MacBook Air M3 & iPhone 15 Pro - Sức mạnh trong tầm tay',
    cta: 'Mua combo',
    link: '/combo',
    bgColor: 'bg-gradient-to-r from-[#907163]/80 via-[#b8917a]/70 to-[#d4b8a8]/60',
    badge: 'TIẾT KIỆM 15%',
    badgeColor: 'from-[#907163] to-[#b8917a]'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=1920&auto=format&fit=crop',
    title: 'STUDIO CREATIVE',
    subtitle: 'KHÔNG GIAN SÁNG TẠO CÙNG APPLE',
    description: 'iPad Pro M4 & Apple Pencil - Biến ý tưởng thành tác phẩm',
    cta: 'Trải nghiệm',
    link: '/danh-muc/ipad',
    bgColor: 'bg-gradient-to-r from-[#5CDB95]/80 via-[#379683]/70 to-[#05386B]/60',
    feature: 'Tặng Apple Pencil 2'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920&auto=format&fit=crop',
    title: 'LIFESTYLE CONNECTED',
    subtitle: 'KẾT NỐI THÔNG MINH - SỐNG ĐẲNG CẤP',
    description: 'Apple Watch Series 9 & AirPods Pro 2 - Đồng hành mọi khoảnh khắc',
    cta: 'Đồng bộ ngay',
    link: '/smart-devices',
    bgColor: 'bg-gradient-to-r from-[#8EE4AF]/80 via-[#5CDB95]/70 to-[#379683]/60',
    badge: 'MIỄN PHÍ GIAO HÀNG',
    badgeColor: 'from-[#5CDB95] to-[#379683]'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1920&auto=format&fit=crop',
    title: 'FAMILY TECH HUB',
    subtitle: 'CÔNG NGHỆ CHO CẢ GIA ĐÌNH',
    description: 'iPhone, iPad, Mac, Apple TV - Trải nghiệm trọn vẹn hệ sinh thái Apple',
    cta: 'Tư vấn gia đình',
    link: '/family-packages',
    bgColor: 'bg-gradient-to-r from-[#EDF5E1]/80 via-[#8EE4AF]/70 to-[#5CDB95]/60',
    stats: [
      { label: 'Gói gia đình', value: '5+' },
      { label: 'Ưu đãi đặc biệt', value: '25%' },
      { label: 'Bảo hành', value: '24 tháng' },
    ]
  },
];

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 lg:mx-0 mt-4 shadow-2xl shadow-gray-400/20">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{ 
          delay: 6000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true 
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        loop
        className="hero-swiper rounded-2xl"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
              {/* Background Image with overlay */}
              <div className="absolute inset-0">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 ${banner.bgColor} mix-blend-multiply`}></div>
                {/* Additional gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="container-custom h-full flex items-center relative z-10">
                <div className="text-white max-w-2xl">
                  {/* Badge */}
                  {banner.badge && (
                    <div className="inline-block mb-4">
                      <span className={`bg-gradient-to-r ${banner.badgeColor} text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg`}>
                        <FiGift className="w-3 h-3" />
                        {banner.badge}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <div className="mb-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 leading-tight">
                      {banner.title}
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] mb-3"></div>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xl sm:text-2xl mb-3 text-white/90 font-medium">
                    {banner.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-lg mb-6 text-white/80 max-w-lg">
                    {banner.description}
                  </p>

                  {/* CTA Button */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      to={banner.link}
                      className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#379683]/40 hover:scale-105 transition-all duration-300"
                    >
                      <FiShoppingBag className="w-5 h-5" />
                      <span>{banner.cta}</span>
                      <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                      <FiPlay className="w-4 h-4" />
                      <span>Xem video</span>
                    </button>
                  </div>

                  {/* Stats */}
                  {banner.stats && (
                    <div className="flex flex-wrap gap-6 mt-8">
                      {banner.stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                          <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                            {Icon && (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8EE4AF]/20 to-[#5CDB95]/20 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div>
                              <div className="text-xl font-bold text-white">{stat.value}</div>
                              <div className="text-xs text-white/70">{stat.label}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Feature */}
                  {banner.feature && (
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] animate-pulse"></div>
                      <span className="text-sm text-white">{banner.feature}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Elements với gradient thay vì logo */}
              <div className="absolute top-10 right-10 hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8EE4AF]/30 to-[#5CDB95]/30 rounded-full blur-xl"></div>
                  <div className="relative flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-3">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-8 h-8 rounded-lg ${
                            i % 2 === 0 
                              ? 'bg-gradient-to-r from-[#8EE4AF]/40 to-[#5CDB95]/40' 
                              : 'bg-gradient-to-r from-[#379683]/40 to-[#5CDB95]/40'
                          } animate-pulse`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 cursor-pointer">
        <FiArrowRight className="w-6 h-6 text-white rotate-180" />
      </div>
      <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 cursor-pointer">
        <FiArrowRight className="w-6 h-6 text-white" />
      </div>

      {/* Pagination Dots Container */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="swiper-pagination"></div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-20 bg-gray-800/30 overflow-hidden">
        <div className="swiper-progress-bar h-full bg-gradient-to-r from-[#8EE4AF] via-[#5CDB95] to-[#379683] w-full"></div>
      </div>

      {/* CSS Styles */}
      <style jsx global>{`
        .hero-swiper {
          border-radius: 1rem;
        }
        
        .swiper-button-prev-custom:after,
        .swiper-button-next-custom:after {
          content: '';
        }
        
        /* FIX: Custom pagination styles */
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
          margin: 0 4px !important;
        }
        
        .swiper-pagination-bullet:hover {
          background: white;
          transform: scale(1.2);
        }
        
        .swiper-pagination-bullet-active {
          background: white !important;
          width: 30px !important;
          border-radius: 5px !important;
        }
        
        /* Progress bar animation - FIXED */
        .swiper-progress-bar {
          width: 100%;
          transform: scaleX(0);
          transform-origin: left;
        }
        
        .swiper-slide-active .swiper-progress-bar {
          animation: progressBar 6s linear forwards;
        }
        
        @keyframes progressBar {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }
        
        .hero-swiper:hover .swiper-progress-bar {
          animation-play-state: paused;
        }
        
        /* Navigation buttons */
        .swiper-button-prev-custom.swiper-button-disabled,
        .swiper-button-next-custom.swiper-button-disabled {
          opacity: 0.3;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;