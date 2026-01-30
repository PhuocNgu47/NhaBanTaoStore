import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FiCalendar,
    FiClock,
    FiEye,
    FiChevronRight,
    FiArrowLeft,
    FiShare2,
    FiUser,
    FiFacebook,
    FiTwitter,
    FiLink
} from "react-icons/fi";
import { mockPosts } from "../data/blogData";

const TechDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        const foundPost = mockPosts.find(p => p.slug === slug);
        if (foundPost) {
            setPost(foundPost);
            // Tìm bài viết liên quan (cùng category, bỏ qua bài hiện tại)
            const related = mockPosts
                .filter(p => p.category === foundPost.category && p.slug !== slug)
                .slice(0, 3);
            setRelatedPosts(related);

            // Scroll to top khi đổi bài
            window.scrollTo(0, 0);
        } else {
            // Nếu không tìm thấy, quay lại trang danh sách
            navigate("/goc-cong-nghe");
        }
    }, [slug, navigate]);

    if (!post) return null;

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumbs & Title Section */}
            <div className="bg-gray-50 border-b">
                <div className="container-custom py-6">
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                        <FiChevronRight size={14} />
                        <Link to="/goc-cong-nghe" className="hover:text-blue-600 transition-colors">Góc công nghệ</Link>
                        <FiChevronRight size={14} />
                        <span className="text-gray-900 font-medium truncate max-w-[200px] md:max-w-md">
                            {post.title}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="container-custom py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <article>
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                                {post.category}
                            </span>

                            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <FiUser size={16} />
                                    </div>
                                    <span className="font-semibold text-gray-800">{post.author}</span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <FiCalendar size={14} />
                                    {post.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FiEye size={14} />
                                    {post.views.toLocaleString()} lượt xem
                                </span>
                            </div>

                            {/* Featured Image */}
                            <div className="rounded-2xl overflow-hidden mb-10 shadow-2xl shadow-blue-100">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-auto object-cover max-h-[500px]"
                                />
                            </div>

                            {/* Content Rendered as HTML */}
                            <div
                                className="prose prose-lg max-w-none text-gray-700 leading-relaxed
                                    prose-headings:text-gray-900 prose-headings:font-bold
                                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                                    prose-p:mb-6 prose-img:rounded-xl prose-img:shadow-lg
                                    prose-ol:list-decimal prose-ul:list-disc prose-li:mb-2"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Share & Actions */}
                            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                                <Link
                                    to="/goc-cong-nghe"
                                    className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                                >
                                    <FiArrowLeft size={18} />
                                    Quay lại tất cả bài viết
                                </Link>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-400 mr-2">Chia sẻ:</span>
                                    <button className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                        <FiFacebook size={18} />
                                    </button>
                                    <button className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-blue-400 hover:text-white transition-all shadow-sm">
                                        <FiTwitter size={18} />
                                    </button>
                                    <button className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-200 transition-all shadow-sm">
                                        <FiLink size={18} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                Bài viết liên quan
                            </h3>

                            <div className="space-y-6">
                                {relatedPosts.length > 0 ? (
                                    relatedPosts.map(relPost => (
                                        <Link
                                            key={relPost.id}
                                            to={`/goc-cong-nghe/${relPost.slug}`}
                                            className="group flex gap-4 items-start"
                                        >
                                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                                <img
                                                    src={relPost.image}
                                                    alt={relPost.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                                    {relPost.title}
                                                </h4>
                                                <span className="text-xs text-gray-400 mt-1 block">
                                                    {relPost.date}
                                                </span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">Chưa có bài viết liên quan nào khác.</p>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <Link
                                    to="/san-pham"
                                    className="bg-blue-600 hover:bg-blue-700 text-white block text-center py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
                                >
                                    Khám phá sản phẩm Apple mới
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechDetailPage;
