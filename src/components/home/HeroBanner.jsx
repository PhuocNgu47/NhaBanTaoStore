import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { fetchBanners } from '../../features/bannerSlice';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Fallback banners nếu không có data từ API
const fallbackBanners = [
  {
    _id: 'fallback-1',
    image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1200&q=80',
    title: 'NHÀ BÁN TÁO STORE',
    subtitle: 'Chuyên Apple chính hãng - Giá tốt nhất thị trường',
    buttonText: 'Khám phá ngay',
    link: '/san-pham',
  },
  {
    _id: 'fallback-2',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1200&q=80',
    title: 'iPhone 16 Pro Max',
    subtitle: 'Chip A18 Pro - Camera 48MP 5x zoom',
    buttonText: 'Mua ngay',
    link: '/danh-muc/iphone',
  },
  {
    _id: 'fallback-3',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',
    title: 'MacBook Air M3',
    subtitle: 'Siêu mỏng nhẹ, hiệu năng vượt trội',
    buttonText: 'Tìm hiểu thêm',
    link: '/danh-muc/macbook',
  },
];

// Get image URL (handle both uploaded files and external URLs)
const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
  return image.startsWith('/') ? `${baseURL}${image}` : `${baseURL}/${image}`;
};

const HeroBanner = () => {
  const dispatch = useDispatch();
  const { activeBanners, loading } = useSelector((state) => state.banners);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  // Use API banners if available, otherwise fallback
  const banners = activeBanners && activeBanners.length > 0 ? activeBanners : fallbackBanners;

  return (
    <section className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={banners.length > 1}
        className="hero-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div className="relative min-h-[200px] md:min-h-[280px] lg:min-h-[350px] bg-gray-900">
              {/* Background Image */}
              <img
                src={getImageUrl(banner.image)}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1200&q=80';
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

              {/* Content */}
              <div className="container-custom relative h-full flex items-center py-6 px-4 md:py-8 md:px-6 lg:py-12 lg:px-8 min-h-[200px] md:min-h-[280px] lg:min-h-[350px]">
                <div className="text-white max-w-xl z-10">
                  {/* Sale Label */}
                  {banner.saleLabel && (
                    <div className="inline-block bg-red-500 px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-2 md:mb-3 text-xs md:text-sm font-bold animate-pulse">
                      {banner.saleLabel}
                      {banner.salePercent > 0 && ` - Giảm ${banner.salePercent}%`}
                    </div>
                  )}

                  <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-2 md:mb-3 drop-shadow-lg">
                    {banner.title}
                  </h1>

                  {banner.subtitle && (
                    <p className="text-sm md:text-lg lg:text-xl mb-4 md:mb-6 text-white/90 drop-shadow">
                      {banner.subtitle}
                    </p>
                  )}

                  <Link
                    to={banner.link || '/san-pham'}
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 md:px-6 md:py-2.5 lg:px-8 lg:py-3 rounded-full text-sm md:text-base font-semibold transition-all hover:scale-105 shadow-lg"
                  >
                    {banner.buttonText || 'Khám phá ngay'}
                  </Link>
                </div>
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
          width: 36px;
          height: 36px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
          transition: all 0.3s;
        }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 14px;
        }
        .hero-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          width: 10px;
          height: 10px;
          transition: all 0.3s;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 24px;
          border-radius: 5px;
        }
        @media (min-width: 768px) {
          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            width: 44px;
            height: 44px;
          }
          .hero-swiper .swiper-button-next::after,
          .hero-swiper .swiper-button-prev::after {
            font-size: 18px;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;

