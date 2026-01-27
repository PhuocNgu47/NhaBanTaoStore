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
    }, 6000); // 6 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [banners.length, isPaused, currentIndex]);

  // Helper function để lấy image URL
  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    if (image.startsWith('/uploads')) return `${baseURL}${image}`;
    if (image.startsWith('/')) return `${baseURL}${image}`;
    return `${baseURL}/uploads/banners/${image}`;
  };

  // Navigation handlers
  const goToSlide = (index) => setCurrentIndex(index);
  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % banners.length);

  // Handle mouse enter/leave for pause
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Debug log (moved before early returns to fix hooks order)
  useEffect(() => {
    const banner = banners[currentIndex];
    if (banner) {
      console.log('Current Banner:', { title: banner.title, image: banner.image });
    }
  }, [banners, currentIndex]);

  // Add floating animation and other keyframes
  const animationStyles = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes shine {
      100% { left: 125%; }
    }
    
    .group:hover .group-hover/btn\:animate-shine {
        animation: shine 1s;
    }
  `;

  if (loading) {
    return (
      <div className="h-[200px] md:h-[260px] lg:h-[320px] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Loading />
      </div>
    );
  }

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <section
      className="relative w-full h-[220px] md:h-[300px] lg:h-[380px] overflow-hidden group"
      style={{
        background: currentBanner.backgroundImageUrl || currentBanner.backgroundImage
          ? `url(${getImageUrl(currentBanner.backgroundImage || currentBanner.backgroundImageUrl)}) center/cover no-repeat`
          : currentBanner.backgroundColor || 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>{animationStyles}</style>

      {/* Background Overlay with Gradient for better text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0"
      />

      {/* Main Content Container */}
      <div className="relative h-full container-custom mx-auto px-4 md:px-8 lg:px-12 z-10">
        <div className="h-full grid grid-cols-12 gap-4 items-center">

          {/* LEFT SIDE - Text Content */}
          <div className="col-span-7 md:col-span-6 flex flex-col justify-center h-full py-4 pl-2 md:pl-0">
            {/* Badge / Accent */}
            <div className="inline-flex items-center space-x-2 mb-3 md:mb-4 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
              <span className="h-0.5 w-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-orange-400">
                New Arrival
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-2xl md:text-4xl lg:text-5xl font-black mb-3 leading-tight tracking-tight drop-shadow-lg
              ${currentBanner.textColor === 'black' ? 'text-gray-900' : 'text-white'}
              opacity-0 animate-[slideUp_0.5s_ease-out_0.2s_forwards]
              `}
              style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
            >
              {currentBanner.title || 'Sản phẩm Apple'}
            </h1>

            {/* Subtitle */}
            {currentBanner.subtitle && (
              <p
                className={`text-sm md:text-base lg:text-lg mb-6 font-medium max-w-lg line-clamp-2 opacity-0 animate-[slideUp_0.5s_ease-out_0.4s_forwards]
                ${currentBanner.textColor === 'black' ? 'text-gray-800' : 'text-gray-200'}`}
              >
                {currentBanner.subtitle}
              </p>
            )}

            {/* CTA Button */}
            <div className="opacity-0 animate-[slideUp_0.5s_ease-out_0.6s_forwards]">
              <Link
                to={currentBanner.link || '/san-pham'}
                className="group/btn relative inline-flex items-center justify-center bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white 
                px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-base 
                shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] 
                hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  {currentBanner.buttonText || 'Khám phá ngay'}
                  <FiChevronRight className="ml-1 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </span>
                {/* Shine effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover/btn:animate-shine" />
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE - Product Image */}
          <div className="col-span-5 md:col-span-6 flex items-center justify-center h-full relative">
            {currentBanner.image && (
              <div className="relative w-full h-full flex items-center justify-center lg:justify-end pr-0 lg:pr-12">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 lg:left-2/3 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[350px] md:h-[350px] bg-gradient-to-tr from-orange-500/30 to-purple-600/30 rounded-full blur-[60px] md:blur-[100px] animate-pulse" />

                {/* Product Image */}
                <img
                  src={getImageUrl(currentBanner.image)}
                  alt={currentBanner.imageAlt || currentBanner.title || 'Sản phẩm'}
                  className="relative h-[85%] md:h-[110%] w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float transform hover:scale-105 transition-transform duration-500 z-10"
                  style={{ maxHeight: '400px' }}
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load banner image:', currentBanner.image);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Glassmorphism */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            aria-label="Previous"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            aria-label="Next"
          >
            <FiChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex
                ? 'bg-gradient-to-r from-orange-400 to-red-500 w-8 shadow-lg'
                : 'bg-white/30 w-2 hover:bg-white/50'
                }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BannerSlider;
