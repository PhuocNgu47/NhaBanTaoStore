import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Social media icons as simple components
const ShopeeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#EE4D2D">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80" />
        <stop offset="50%" stopColor="#F56040" />
        <stop offset="100%" stopColor="#C13584" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#instagram-gradient)" />
    <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2" />
    <circle cx="17" cy="7" r="1.5" fill="white" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#000">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.132-1.13 3.628-1.154 1.162-.018 2.209.134 3.13.388-.024-.94-.197-1.7-.564-2.324-.463-.79-1.227-1.225-2.337-1.332-.834-.08-1.63.079-2.164.353l-.857-1.867c.844-.394 1.904-.597 3.155-.505 1.698.124 2.984.807 3.82 2.03.707 1.032.984 2.371 1.02 3.836l.004.252c.96.357 1.75.888 2.328 1.57.828 1.033 1.208 2.378 1.102 3.893-.122 1.737-.859 3.265-2.193 4.544-1.756 1.681-4.097 2.455-7.16 2.455l-.027-.001zM10.8 16.274c.036.655.322 1.155.828 1.445.475.271 1.115.372 1.766.339 1.053-.058 1.86-.43 2.397-1.104.456-.573.752-1.39.87-2.416-.673-.173-1.432-.264-2.274-.264-.043 0-.087 0-.13.002-.96.015-1.747.237-2.28.644-.526.401-.792.898-.778 1.354l.001.001v-.001z" />
  </svg>
);

const socialLinks = [
  { name: 'Shopee', icon: ShopeeIcon, url: 'https://shopee.vn', color: 'hover:border-orange-500' },
  { name: 'Instagram', icon: InstagramIcon, url: 'https://instagram.com', color: 'hover:border-pink-500' },
  { name: 'Facebook', icon: FacebookIcon, url: 'https://facebook.com', color: 'hover:border-blue-600' },
  { name: 'TikTok', icon: TikTokIcon, url: 'https://tiktok.com', color: 'hover:border-gray-800' },
  { name: 'Thread', icon: ThreadsIcon, url: 'https://threads.net', color: 'hover:border-gray-800' },
];

const defaultImages = [
  { id: 1, src: 'https://nhataostore.com/Content/Images/khachhang/z4798375782828_099e1b35bb9b5b592192ff1fdd20327d.jpg', alt: 'Khách hàng 1' },
  { id: 2, src: 'https://nhataostore.com/Content/Images/khachhang/z4798375151173_05898d5e2393a5adf9921877a9ac07ba.jpg', alt: 'Khách hàng 2' },
  { id: 3, src: 'https://nhataostore.com/Content/Images/khachhang/z4798404489335_22222e78d4952b89dde8a7f651712ebf.jpg', alt: 'Khách hàng 3' },
  { id: 4, src: 'https://nhataostore.com/Content/Images/khachhang/z4798422022630_ba17945999f99e0de7d92600042d49a6.jpg', alt: 'Khách hàng 4' },
  { id: 5, src: 'https://nhataostore.com/Content/Images/khachhang/z4798375777611_88a88cb7573dfc0b416c0c56919a921a.jpg', alt: 'Khách hàng 5' },
];

const SocialGallery = ({
  title = 'GHÉ XEM GIAN HÀNG CỦA NHÀ BÁN TÁO STORE TẠI',
  images = defaultImages,
  socials = socialLinks
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    <section className="py-10 bg-white">
      <div className="container-custom">
        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h2>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-full 
                         bg-white transition-all duration-200 ${social.color} hover:shadow-md`}
            >
              <social.icon />
              <span className="text-sm font-medium text-gray-700">{social.name}</span>
            </a>
          ))}
        </div>

        {/* Image Gallery */}
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 
                       rounded-full shadow-lg flex items-center justify-center hover:bg-white 
                       transition-all"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* Images Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="flex-shrink-0 w-[300px] md:w-[350px] aspect-[4/3] rounded-lg overflow-hidden 
                         shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/350x260?text=Customer+Photo';
                  }}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 
                       rounded-full shadow-lg flex items-center justify-center hover:bg-white 
                       transition-all"
            >
              <FiChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SocialGallery;
