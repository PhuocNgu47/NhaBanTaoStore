import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiArrowRight, FiChevronRight, FiEye } from "react-icons/fi";
import { mockPosts, categories } from "../data/blogData";

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
