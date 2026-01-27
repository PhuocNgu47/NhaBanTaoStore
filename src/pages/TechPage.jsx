import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiArrowRight, FiChevronRight, FiEye } from "react-icons/fi";

// Mock data cho bài viết - giống cấu trúc của anhphibantao
const mockPosts = [
    {
        id: 1,
        title: "iPhone 16 Pro Max: Đánh giá chi tiết sau 1 tháng sử dụng",
        excerpt: "Trải nghiệm thực tế iPhone 16 Pro Max với camera 48MP, chip A18 Pro và thời lượng pin ấn tượng. Liệu có đáng để nâng cấp từ iPhone 15 Pro Max?",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
        category: "Đánh giá",
        date: "25/01/2026",
        views: 1250,
        slug: "danh-gia-iphone-16-pro-max",
    },
    {
        id: 2,
        title: "MacBook Air M3: Mạnh mẽ hơn nhưng có đáng nâng cấp?",
        excerpt: "Apple ra mắt MacBook Air với chip M3, hiệu năng cải thiện đáng kể so với M2. So sánh chi tiết và hướng dẫn chọn mua phù hợp với nhu cầu.",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        category: "Đánh giá",
        date: "22/01/2026",
        views: 980,
        slug: "danh-gia-macbook-air-m3",
    },
    {
        id: 3,
        title: "5 mẹo tiết kiệm pin iPhone cực hiệu quả năm 2026",
        excerpt: "Những cài đặt đơn giản giúp iPhone của bạn dùng được lâu hơn trong ngày mà vẫn giữ nguyên trải nghiệm sử dụng mượt mà.",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800",
        category: "Thủ thuật",
        date: "20/01/2026",
        views: 2100,
        slug: "meo-tiet-kiem-pin-iphone",
    },
    {
        id: 4,
        title: "Apple Watch Series 10: Tất cả những gì bạn cần biết",
        excerpt: "Thiết kế mỏng nhất từ trước đến nay, màn hình lớn hơn và tính năng sức khỏe được nâng cấp. Có nên mua Apple Watch mới?",
        image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800",
        category: "Tin tức",
        date: "18/01/2026",
        views: 756,
        slug: "apple-watch-series-10",
    },
    {
        id: 5,
        title: "So sánh iPad Pro M4 vs iPad Air M2: Nên chọn máy nào?",
        excerpt: "Hướng dẫn chi tiết giúp bạn lựa chọn iPad phù hợp với nhu cầu sử dụng và ngân sách. Phân tích ưu nhược điểm từng dòng máy.",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
        category: "So sánh",
        date: "15/01/2026",
        views: 1890,
        slug: "so-sanh-ipad-pro-m4-vs-ipad-air-m2",
    },
    {
        id: 6,
        title: "AirPods Pro 2: Đánh giá sau 6 tháng sử dụng",
        excerpt: "Chống ồn tốt hơn, âm thanh không gian xuất sắc và thời lượng pin ấn tượng. Liệu AirPods Pro 2 có xứng đáng với mức giá?",
        image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800",
        category: "Đánh giá",
        date: "12/01/2026",
        views: 1456,
        slug: "danh-gia-airpods-pro-2",
    },
    {
        id: 7,
        title: "Hướng dẫn cài đặt eSIM trên iPhone chi tiết nhất",
        excerpt: "Từng bước cài đặt eSIM cho iPhone, hỗ trợ tất cả các nhà mạng tại Việt Nam. Giải đáp thắc mắc thường gặp.",
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
        category: "Hướng dẫn",
        date: "10/01/2026",
        views: 3200,
        slug: "huong-dan-cai-dat-esim-iphone",
    },
    {
        id: 8,
        title: "Top 10 phụ kiện MacBook đáng mua nhất 2026",
        excerpt: "Tổng hợp những phụ kiện thiết yếu giúp nâng cao trải nghiệm sử dụng MacBook của bạn, từ hub USB-C đến bàn phím ngoài.",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
        category: "Tư vấn",
        date: "08/01/2026",
        views: 2450,
        slug: "top-phu-kien-macbook-2026",
    },
];

// Danh mục bài viết
const categories = [
    { name: "Tất cả", value: "all" },
    { name: "Đánh giá", value: "Đánh giá" },
    { name: "Tin tức", value: "Tin tức" },
    { name: "Thủ thuật", value: "Thủ thuật" },
    { name: "Hướng dẫn", value: "Hướng dẫn" },
    { name: "So sánh", value: "So sánh" },
    { name: "Tư vấn", value: "Tư vấn" },
];

// Featured article card - bài viết nổi bật lớn
const FeaturedArticle = ({ post }) => (
    <Link
        to={`/goc-cong-nghe/${post.slug}`}
        className="group block relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300"
    >
        <div className="aspect-[16/9] overflow-hidden">
            <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full mb-3">
                {post.category}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                {post.title}
            </h2>
            <p className="text-gray-300 text-sm line-clamp-2 mb-3 hidden md:block">
                {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    {post.date}
                </span>
                <span className="flex items-center gap-1">
                    <FiEye size={14} />
                    {post.views.toLocaleString()} lượt xem
                </span>
            </div>
        </div>
    </Link>
);

// Article card component - giống style anhphibantao
const ArticleCard = ({ post }) => (
    <Link
        to={`/goc-cong-nghe/${post.slug}`}
        className="group flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
        {/* Image */}
        <div className="w-32 md:w-40 flex-shrink-0 overflow-hidden">
            <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded mb-2">
                    {post.category}
                </span>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                </h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                    <FiCalendar size={12} />
                    {post.date}
                </span>
                <span className="flex items-center gap-1">
                    <FiEye size={12} />
                    {post.views.toLocaleString()}
                </span>
            </div>
        </div>
    </Link>
);

// Article grid card - cho layout grid
const ArticleGridCard = ({ post }) => (
    <Link
        to={`/goc-cong-nghe/${post.slug}`}
        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden">
            <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
        </div>

        {/* Content */}
        <div className="p-4">
            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded mb-2">
                {post.category}
            </span>
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                {post.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <FiCalendar size={12} />
                    {post.date}
                </span>
                <span className="flex items-center gap-1">
                    <FiEye size={12} />
                    {post.views.toLocaleString()} lượt xem
                </span>
            </div>
        </div>
    </Link>
);

export default function TechPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const featuredPost = mockPosts[0];
    const sidebarPosts = mockPosts.slice(1, 4);

    const filteredPosts = selectedCategory === "all"
        ? mockPosts.slice(4)
        : mockPosts.filter((post) => post.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b">
                <div className="container-custom py-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Link to="/" className="hover:text-blue-600 transition-colors">
                            Trang chủ
                        </Link>
                        <FiChevronRight size={14} />
                        <span className="text-gray-900 font-medium">Góc công nghệ</span>
                    </nav>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Cẩm nang sử dụng
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Tổng hợp các bài viết chia sẻ kinh nghiệm, thủ thuật và hướng dẫn sử dụng các sản phẩm công nghệ
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom py-8">
                {/* Featured Section - Bài viết nổi bật */}
                <section className="mb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Featured */}
                        <div className="lg:col-span-2">
                            <FeaturedArticle post={featuredPost} />
                        </div>

                        {/* Sidebar articles */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 pb-2 border-b">
                                Bài viết mới
                            </h3>
                            {sidebarPosts.map((post) => (
                                <ArticleCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categories Filter */}
                <section className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                    ${selectedCategory === cat.value
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* All Articles Grid */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {selectedCategory === "all" ? "Tất cả bài viết" : `${selectedCategory}`}
                    </h2>

                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post) => (
                                <ArticleGridCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl">
                            <p className="text-gray-500">
                                Chưa có bài viết trong danh mục này
                            </p>
                        </div>
                    )}
                </section>

                {/* Load More Button */}
                {filteredPosts.length > 0 && (
                    <div className="text-center mt-10">
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all">
                            Xem thêm bài viết
                            <FiArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
