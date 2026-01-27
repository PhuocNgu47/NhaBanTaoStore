import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { fetchBanners } from '../../features/bannerSlice';
import { Loading } from '../common';

const BannerSlider = () => {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.banners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 8000); // 8 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [banners.length, isPaused, currentIndex]);

  // Helper function để lấy image URL
  const getImageUrl = (image) => {
    if (!image) {
      console.warn('Banner image is missing');
      return '';
    }
    
    // Nếu đã là full URL (http/https), trả về trực tiếp
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    
    // Lấy base URL từ env hoặc default
    const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    
    // Nếu image path đã bắt đầu bằng /uploads, chỉ cần thêm baseURL
    if (image.startsWith('/uploads')) {
      return `${baseURL}${image}`;
    }
    
    // Nếu image path bắt đầu bằng /, thêm baseURL
    if (image.startsWith('/')) {
      return `${baseURL}${image}`;
    }
    
    // Nếu không có / ở đầu, thêm /uploads/banners/ (fallback)
    return `${baseURL}/uploads/banners/${image}`;
  };

  // Navigation handlers
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // Handle mouse enter/leave for pause
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (loading) {
    return (
      <div className="h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center bg-slate-900">
        <Loading />
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];
  
  // Debug: Log banner data để kiểm tra
  useEffect(() => {
    if (currentBanner) {
      console.log('Current Banner:', {
        title: currentBanner.title,
        image: currentBanner.image,
        imageUrl: getImageUrl(currentBanner.image),
        subtitle: currentBanner.subtitle
      });
    }
  }, [currentBanner, currentIndex]);

  return (
    <section
      className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-slate-900 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Gradient (optional) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 opacity-50" />

      {/* Main Content Container */}
      <div className="relative h-full container-custom mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        <div className="h-full grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8 items-center">
          {/* LEFT SIDE - Text Content (60% on desktop) */}
          <div className="md:col-span-3 flex flex-col justify-center h-full px-3 md:px-4 lg:px-6 relative">
            {/* Accent Line (Top) - Hidden on mobile, visible on tablet+ */}
            <div className="hidden md:block absolute top-0 left-4 w-[50px] h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mb-4" />

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-blue-200 leading-tight tracking-wider uppercase">
              {currentBanner.title || 'IPAD AIR 7'}
            </h1>

            {/* Subtitle */}
            {currentBanner.subtitle && (
              <p className="text-xs md:text-sm lg:text-base text-gray-300 mb-4 md:mb-5 font-normal max-w-lg">
                {currentBanner.subtitle}
              </p>
            )}

            {/* CTA Button */}
            <Link
              to={currentBanner.link || '/san-pham'}
              className="inline-block w-fit bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-5 md:px-6 lg:px-8 py-2 md:py-2.5 lg:py-3 rounded-lg font-bold text-xs md:text-sm lg:text-base shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:scale-105"
              aria-label={currentBanner.buttonText || 'Tìm hiểu ngay'}
            >
              {currentBanner.buttonText || 'TÌM HIỂU NGAY'}
            </Link>
          </div>

          {/* RIGHT SIDE - Product Image (40% on desktop) */}
          <div className="md:col-span-2 flex items-center justify-center h-full relative">
            {currentBanner.image ? (
              <div className="relative w-full max-w-[380px] h-auto flex items-center justify-center">
                {/* Optional background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl opacity-20" />
                
                {/* Product Image */}
                <img
                  src={getImageUrl(currentBanner.image)}
                  alt={currentBanner.imageAlt || currentBanner.title || 'Sản phẩm'}
                  className="relative w-full h-auto max-h-[300px] object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105 z-10"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load banner image:', currentBanner.image);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-sm">Chưa có ảnh sản phẩm</p>
                  {currentBanner.title && (
                    <p className="text-xs text-gray-600 mt-1">{currentBanner.title}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Only on tablet+ */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/10 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Previous banner"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/10 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Next banner"
          >
            <FiChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator - Bottom Center */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white opacity-100 scale-125'
                  : 'bg-gray-500 opacity-50 hover:opacity-75 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Transition Effect */}
      <style>{`
        .banner-slide-enter {
          opacity: 0;
          transform: translateX(20px);
        }
        .banner-slide-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 700ms ease-in-out, transform 700ms ease-in-out;
        }
        .banner-slide-exit {
          opacity: 1;
          transform: translateX(0);
        }
        .banner-slide-exit-active {
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 700ms ease-in-out, transform 700ms ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default BannerSlider;
