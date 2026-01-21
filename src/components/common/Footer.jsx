import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { SiZalo } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🍎</span>
              </div>
              <span className="text-xl font-bold">NHÀ BÁN TÁO STORE</span>
            </div>
            <p className="text-gray-400 mb-4">
              Chuyên cung cấp các sản phẩm Apple chính hãng với giá tốt nhất thị trường.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiYoutube size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <SiZalo size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/gioi-thieu" className="text-gray-400 hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/san-pham" className="text-gray-400 hover:text-white transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/goc-cong-nghe" className="text-gray-400 hover:text-white transition-colors">
                  Góc công nghệ
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="text-gray-400 hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Chính sách</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/chinh-sach-bao-hanh" className="text-gray-400 hover:text-white transition-colors">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach-doi-tra" className="text-gray-400 hover:text-white transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach-van-chuyen" className="text-gray-400 hover:text-white transition-colors">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach-bao-mat" className="text-gray-400 hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-400">
                  123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-blue-500 flex-shrink-0" size={20} />
                <a href="tel:0123456789" className="text-gray-400 hover:text-white transition-colors">
                  0123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-blue-500 flex-shrink-0" size={20} />
                <a href="mailto:info@anhphibantao.com" className="text-gray-400 hover:text-white transition-colors">
                  info@anhphibantao.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-4">
          <p className="text-center text-gray-400 text-sm">
            © 2026 Nhà Bán Táo Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
