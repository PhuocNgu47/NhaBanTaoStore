import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const banners = [
  {
    id: 1,
    image: '/banners/banner1.jpg',
    title: 'NHÀ BÁN TÁO STORE',
    subtitle: 'CHÍNH HÃNG APPLE',
    cta: 'Mua ngay',
    link: '/san-pham',
    bgColor: 'bg-gradient-to-r from-blue-600 to-blue-800',
  },
  {
    id: 2,
    image: '/banners/banner2.jpg',
    title: 'iPad Pro M4',
    subtitle: 'Siêu mỏng, siêu mạnh',
    cta: 'Khám phá',
    link: '/danh-muc/ipad',
    bgColor: 'bg-gradient-to-r from-purple-600 to-purple-800',
  },
  {
    id: 3,
    image: '/banners/banner3.jpg',
    title: 'MacBook Air M3',
    subtitle: 'Nhẹ nhàng, mạnh mẽ',
    cta: 'Tìm hiểu thêm',
    link: '/danh-muc/macbook',
    bgColor: 'bg-gradient-to-r from-gray-700 to-gray-900',
  },
];

const HeroBanner = () => {
  return (
    <section className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="hero-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className={`${banner.bgColor} relative h-[300px] sm:h-[400px] lg:h-[500px]`}
            >
              <div className="container-custom h-full flex items-center">
                <div className="text-white max-w-xl z-10">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                    {banner.title}
                  </h1>
                  <p className="text-xl sm:text-2xl mb-6 text-white/90">
                    {banner.subtitle}
                  </p>
                  <Link
                    to={banner.link}
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
                  >
                    {banner.cta}
                  </Link>
                </div>
              </div>
              {/* Placeholder for banner image */}
              <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center opacity-20">
                <span className="text-9xl">🍎</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 20px;
        }
        .hero-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;
