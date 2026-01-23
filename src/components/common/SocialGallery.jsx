import { useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiInstagram, FiFacebook, FiHeart, FiShare2 } from 'react-icons/fi';

// Social media icons - Updated with gradient colors
const ShopeeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="url(#shopee-gradient)">
    <defs>
      <linearGradient id="shopee-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EE4D2D" />
        <stop offset="100%" stopColor="#ff6b4a" />
      </linearGradient>
    </defs>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFDC80" />
        <stop offset="25%" stopColor="#F56040" />
        <stop offset="50%" stopColor="#C13584" />
        <stop offset="75%" stopColor="#833AB4" />
        <stop offset="100%" stopColor="#5851DB" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#instagram-gradient)"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2"/>
    <circle cx="17" cy="7" r="1.5" fill="white"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="url(#facebook-gradient)">
    <defs>
      <linearGradient id="facebook-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1877F2" />
        <stop offset="100%" stopColor="#0A5BC4" />
      </linearGradient>
    </defs>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="url(#tiktok-gradient)">
    <defs>
      <linearGradient id="tiktok-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#000000" />
        <stop offset="50%" stopColor="#25F4EE" />
        <stop offset="100%" stopColor="#FE2C55" />
      </linearGradient>
    </defs>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="url(#threads-gradient)">
    <defs>
      <linearGradient id="threads-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#000000" />
        <stop offset="50%" stopColor="#555555" />
        <stop offset="100%" stopColor="#888888" />
      </linearGradient>
    </defs>
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.132-1.13 3.628-1.154 1.162-.018 2.209.134 3.13.388-.024-.94-.197-1.7-.564-2.324-.463-.79-1.227-1.225-2.337-1.332-.834-.08-1.63.079-2.164.353l-.857-1.867c.844-.394 1.904-.597 3.155-.505 1.698.124 2.984.807 3.82 2.03.707 1.032.984 2.371 1.02 3.836l.004.252c.96.357 1.75.888 2.328 1.57.828 1.033 1.208 2.378 1.102 3.893-.122 1.737-.859 3.265-2.193 4.544-1.756 1.681-4.097 2.455-7.16 2.455l-.027-.001zM10.8 16.274c.036.655.322 1.155.828 1.445.475.271 1.115.372 1.766.339 1.053-.058 1.86-.43 2.397-1.104.456-.573.752-1.39.87-2.416-.673-.173-1.432-.264-2.274-.264-.043 0-.087 0-.13.002-.96.015-1.747.237-2.28.644-.526.401-.792.898-.778 1.354l.001.001v-.001z"/>
  </svg>
);

const socialLinks = [
  { 
    name: 'Shopee', 
    icon: ShopeeIcon, 
    url: 'https://shopee.vn', 
    color: 'hover:border-[#EE4D2D] hover:shadow-[#EE4D2D]/20',
    bgColor: 'bg-gradient-to-r from-[#EE4D2D]/5 to-[#EE4D2D]/10'
  },
  { 
    name: 'Instagram', 
    icon: InstagramIcon, 
    url: 'https://instagram.com', 
    color: 'hover:border-[#C13584] hover:shadow-[#C13584]/20',
    bgColor: 'bg-gradient-to-r from-[#C13584]/5 to-[#5851DB]/10'
  },
  { 
    name: 'Facebook', 
    icon: FacebookIcon, 
    url: 'https://facebook.com', 
    color: 'hover:border-[#1877F2] hover:shadow-[#1877F2]/20',
    bgColor: 'bg-gradient-to-r from-[#1877F2]/5 to-[#0A5BC4]/10'
  },
  { 
    name: 'TikTok', 
    icon: TikTokIcon, 
    url: 'https://tiktok.com', 
    color: 'hover:border-[#000000] hover:shadow-[#25F4EE]/20',
    bgColor: 'bg-gradient-to-r from-[#000000]/5 to-[#FE2C55]/10'
  },
  { 
    name: 'Threads', 
    icon: ThreadsIcon, 
    url: 'https://threads.net', 
    color: 'hover:border-gray-800 hover:shadow-gray-800/20',
    bgColor: 'bg-gradient-to-r from-gray-500/5 to-gray-700/10'
  },
];

const defaultImages = [
  { 
    id: 1, 
    src: 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=800&auto=format&fit=crop', 
    alt: 'Ca sĩ Sơn Tùng M-TP với iPhone 15 Pro Max',
    caption: 'Sơn Tùng M-TP - iPhone 15 Pro Max',
    likes: 1545,
    verified: true
  },
  { 
    id: 2, 
    src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80', 
    alt: 'Người nổi tiếng với MacBook Air M2',
    caption: 'KOL Công nghệ - MacBook Air M2',
    likes: 892,
    verified: true
  },
  { 
    id: 3, 
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w-800&auto=format&fit=crop', 
    alt: 'Diễn viên Hồng Đăng với Apple Watch Series 9',
    caption: 'Hồng Đăng - Apple Watch Series 9',
    likes: 765,
    verified: true
  },
  { 
    id: 4, 
    src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w-800&auto=format&fit=crop', 
    alt: 'MC Phan Anh với iPad Pro M2',
    caption: 'Phan Anh - iPad Pro M2',
    likes: 623,
    verified: true
  },
  { 
    id: 5, 
    src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w-800&auto=format&fit=crop', 
    alt: 'Army với AirPods Pro 2',
    caption: 'Army - AirPods Pro 2',
    likes: 987,
    verified: true
  },
  { 
    id: 6, 
    src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w-800&auto=format&fit=crop', 
    alt: 'Streamer Xemesis với bộ sưu tập Apple',
    caption: 'Xemesis - Bộ sưu tập Apple đầy đủ',
    likes: 2110,
    verified: true
  },
  { 
    id: 7, 
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w-800&auto=format&fit=crop', 
    alt: 'Diễn viên Midu với iPhone 14 Pro',
    caption: 'Midu - iPhone 14 Pro màu Tím',
    likes: 1342,
    verified: true
  },
  { 
    id: 8, 
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w-800&auto=format&fit=crop', 
    alt: 'Ca sĩ Jack với MacBook Pro M3',
    caption: 'Jack - MacBook Pro M3 Max',
    likes: 876,
    verified: true
  },
];

const SocialGallery = ({ 
  title = 'GHÉ XEM GIAN HÀNG CỦA NHÀ BÁN TÁO STORE TẠI',
  subtitle = 'Khám phá hình ảnh thực tế từ khách hàng của chúng tôi',
  images = defaultImages,
  socials = socialLinks 
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#EDF5E1]/30">
      <div className="container-custom">
        {/* Header with gradient title */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[#379683] to-[#5CDB95] bg-clip-text text-transparent">
              Kết nối với chúng tôi
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#379683] via-[#5CDB95] to-[#907163] bg-clip-text text-transparent mb-3">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Social Links - Updated design */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-3 px-6 py-3 rounded-2xl ${social.bgColor} 
                         border border-gray-200 transition-all duration-300 hover:scale-105 
                         hover:shadow-xl ${social.color} backdrop-blur-sm`}
            >
              <div className="relative">
                <social.icon />
                <div className="absolute -inset-2 bg-current opacity-0 group-hover:opacity-10 blur transition-opacity duration-300 rounded-full"></div>
              </div>
              <span className="text-sm font-semibold text-gray-800">{social.name}</span>
              <FiExternalLink className="w-4 h-4 text-gray-500 group-hover:text-current transition-colors" />
            </a>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Khách hàng', value: '10K+', color: 'from-[#8EE4AF] to-[#5CDB95]' },
            { label: 'Đánh giá 5★', value: '98%', color: 'from-[#907163] to-[#b8917a]' },
            { label: 'Sản phẩm bán', value: '50K+', color: 'from-[#379683] to-[#5CDB95]' },
            { label: 'Hài lòng', value: '99%', color: 'from-[#8EE4AF] to-[#EDF5E1]' },
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100"
            >
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              <div className="h-1 w-full bg-gray-100 rounded-full mt-3 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                  style={{ width: '90%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Gallery - Enhanced design */}
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 
                       bg-gradient-to-r from-[#379683] to-[#5CDB95] text-white 
                       rounded-full shadow-xl flex items-center justify-center 
                       hover:scale-110 hover:shadow-2xl transition-all"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Images Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="flex-shrink-0 w-[280px] md:w-[320px] group relative"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 
                              hover:shadow-2xl hover:shadow-[#8EE4AF]/30 transition-all duration-500 
                              border border-gray-100">
                  {/* Image with overlay */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Verified badge */}
                    {image.verified && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-[#5CDB95] to-[#379683] 
                                    text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        VERIFIED
                      </div>
                    )}
                    
                    {/* Like button */}
                    <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full 
                                    p-2 opacity-0 group-hover:opacity-100 transform translate-y-2 
                                    group-hover:translate-y-0 transition-all duration-300 
                                    hover:bg-white hover:scale-110">
                      <FiHeart className="w-4 h-4 text-[#907163]" />
                    </button>
                    
                    {/* Share button */}
                    <button className="absolute top-12 right-3 bg-white/90 backdrop-blur-sm rounded-full 
                                    p-2 opacity-0 group-hover:opacity-100 transform translate-y-2 
                                    group-hover:translate-y-0 transition-all duration-300 delay-75 
                                    hover:bg-white hover:scale-110">
                      <FiShare2 className="w-4 h-4 text-[#379683]" />
                    </button>
                    
                    {/* Likes count */}
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white 
                                  text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <FiHeart className="w-3 h-3" />
                      <span>{image.likes.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  <div className="p-4 bg-gradient-to-b from-white to-[#EDF5E1]/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{image.caption}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <FiInstagram className="w-3 h-3" />
                          @nhabantao_store
                        </p>
                      </div>
                      {image.verified && (
                        <div className="flex items-center gap-1 text-[#5CDB95]">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Celebrity tag */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] 
                                    flex items-center justify-center text-white text-xs font-bold">
                        {image.caption.split(' - ')[0].charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-[#379683]">
                        {image.caption.split(' - ')[0]} - Khách hàng VIP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 
                       bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] text-white 
                       rounded-full shadow-xl flex items-center justify-center 
                       hover:scale-110 hover:shadow-2xl transition-all"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/nhabantao_store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#379683] 
                      to-[#5CDB95] text-white font-semibold rounded-xl hover:shadow-xl 
                      hover:shadow-[#379683]/40 hover:scale-105 active:scale-95 
                      transition-all duration-300"
          >
            <FiExternalLink className="w-5 h-5" />
            <span>Khám phá thêm trên Instagram</span>
          </a>
          <p className="text-sm text-gray-500 mt-3">
            Theo dõi @nhabantao_store để cập nhật sản phẩm mới nhất và ưu đãi đặc biệt
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialGallery;