import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Animation */}
            <div className="relative mb-8">
              <div className="text-8xl mb-4 animate-bounce">💥</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-red-400 rounded-full opacity-20 animate-ping"></div>
              </div>
            </div>

            {/* Error Title */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Ôi trời ơi! Có lỗi xảy ra rồi! 😱
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Đừng lo, đây không phải là lỗi của bạn đâu!
                <br />
                Có thể là iPhone của bạn quá "hot" nên "crash" mất rồi! 🔥📱
              </p>
            </div>

            {/* Error Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-red-200">
              <div className="flex items-center justify-center mb-4">
                <FiAlertTriangle className="w-6 h-6 text-red-500 mr-2" />
                <span className="text-sm font-medium text-red-600">Chi tiết lỗi (chỉ hiển thị trong development):</span>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="text-left bg-gray-50 p-4 rounded-lg text-sm font-mono text-gray-700 max-h-32 overflow-y-auto">
                  <p className="font-semibold text-red-600 mb-2">Error:</p>
                  <p>{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <>
                      <p className="font-semibold text-red-600 mt-2 mb-2">Component Stack:</p>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mt-4">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                  Lỗi này có thể do mạng chậm! 🌐
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                  Hoặc là server đang "nghỉ ngơi"! 😴
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                  Có thể là bug trong code! 🐛
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Hay đơn giản là "force quit" app! 📱
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FiRefreshCw className="w-5 h-5" />
                Thử lại xem sao! 🔄
              </button>

              <Link
                to="/"
                className="flex items-center gap-2 bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FiHome className="w-5 h-5" />
                Về trang chủ an toàn 🏠
              </Link>
            </div>

            {/* Footer Message */}
            <div className="mt-8 text-sm text-gray-500">
              <p>🛠️ Đội ngũ kỹ thuật của chúng tôi đã được thông báo về lỗi này!</p>
              <p className="mt-1">📞 Nếu lỗi vẫn tiếp tục, hãy liên hệ hotline: 1800-XXXX</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;