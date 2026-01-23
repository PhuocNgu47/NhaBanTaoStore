import { Link } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiSearch, FiSmile } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 animate-pulse">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-linear-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>

        {/* Emoji and Title */}
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">🤖</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Ôi không! Trang này đã "mất hút" rồi! 🕵️‍♂️
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Có vẻ như bạn đã lạc vào vùng đất không tồn tại...
            <br />
            Hoặc có thể là iPhone mới của bạn đã "teleport" mất trang này! 📱✨
          </p>
        </div>

        {/* Funny Messages */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-center mb-4">
            <FiSmile className="w-6 h-6 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-600">Một số khả năng có thể xảy ra:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
              Link này đã bị "hack" bởi Tim Cook! 🍎
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Trang này đang "nghỉ phép" ở Cupertino! 🏢
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              Bạn gõ sai URL? Hay là Siri "điều hướng sai"? 🎯
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Trang này đã "upgrade" lên iOS 18! 📈
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FiHome className="w-5 h-5" />
            Về trang chủ thôi! 🏠
          </Link>

          <Link
            to="/san-pham"
            className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FiShoppingBag className="w-5 h-5" />
            Mua iPhone mới đây! 📱
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <FiSearch className="w-5 h-5" />
            <span className="font-medium">Thử tìm kiếm sản phẩm bạn cần:</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {['iPhone 15', 'MacBook', 'iPad', 'AirPods', 'Apple Watch'].map((product) => (
              <Link
                key={product}
                to={`/san-pham?search=${encodeURIComponent(product)}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {product}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-sm text-gray-500">
          <p>🚀 Nếu bạn tin rằng đây là lỗi, hãy liên hệ với đội ngũ "Apple Genius" của chúng tôi!</p>
          <p className="mt-1">💡 Mẹo: Hãy bookmark trang chủ để không bị lạc nữa nhé! 📌</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;