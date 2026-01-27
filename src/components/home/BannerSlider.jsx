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
      className="relative w-full h-[200px] md:h-[260px] lg:h-[320px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Content Container */}
      <div className="relative h-full container-custom mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-full grid grid-cols-5 md:grid-cols-2 gap-4 items-center">

          {/* LEFT SIDE - Text Content */}
          <div className="col-span-3 md:col-span-1 flex flex-col justify-center h-full py-4 relative z-10">
            {/* Accent Line */}
            <div className="w-10 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-3" />

            {/* Title */}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-white leading-tight">
              {currentBanner.title || 'Sản phẩm Apple'}
            </h1>

            {/* Subtitle */}
            {currentBanner.subtitle && (
              <p className="text-xs md:text-sm text-gray-300 mb-3 font-normal max-w-sm line-clamp-2">
                {currentBanner.subtitle}
              </p>
            )}

            {/* CTA Button */}
            <Link
              to={currentBanner.link || '/san-pham'}
              className="inline-flex items-center w-fit bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {currentBanner.buttonText || 'Khám phá'}
              <FiChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {/* RIGHT SIDE - Product Image */}
          <div className="col-span-2 md:col-span-1 flex items-center justify-center h-full relative">
            {currentBanner.image && (
              <div className="relative w-full h-full flex items-center justify-center py-2">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-2xl blur-xl" />

                {/* Product Image - LARGER */}
                <img
                  src={getImageUrl(currentBanner.image)}
                  alt={currentBanner.imageAlt || currentBanner.title || 'Sản phẩm'}
                  className="relative h-[90%] w-auto max-w-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-110 z-10"
                  style={{ maxHeight: '280px', minHeight: '150px' }}
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

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Next"
          >
            <FiChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-white w-5'
                  : 'bg-white/40 w-1.5 hover:bg-white/60'
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
