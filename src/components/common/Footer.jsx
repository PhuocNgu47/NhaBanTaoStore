import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { SiZalo, SiTiktok } from 'react-icons/si';
import { useSettings } from '../../contexts/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

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
              <span className="text-xl font-bold uppercase">{settings.siteName || 'NHÀ BÁN TÁO STORE'}</span>
            </div>
            <p className="text-gray-400 mb-4">
              {settings.siteDescription || 'Chuyên cung cấp các sản phẩm Apple chính hãng với giá tốt nhất thị trường.'}
            </p>
            <div className="flex gap-4">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <FiFacebook size={24} />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <FiInstagram size={24} />
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <FiYoutube size={24} />
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <SiTiktok size={24} />
                </a>
              )}
              {settings.zalo && (
                <a href={`https://zalo.me/${settings.zalo}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <SiZalo size={24} />
                </a>
              )}
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
                  {settings.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-blue-500 flex-shrink-0" size={20} />
                <a href={`tel:${settings.phone}`} className="text-gray-400 hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </li>
              {settings.hotline && (
                <li className="flex items-center gap-3">
                  <FiPhone className="text-red-500 flex-shrink-0" size={20} />
                  <span className="text-gray-400">Hotline: </span>
                  <a href={`tel:${settings.hotline}`} className="text-gray-400 hover:text-white transition-colors">
                    {settings.hotline}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <FiMail className="text-blue-500 flex-shrink-0" size={20} />
                <a href={`mailto:${settings.email}`} className="text-gray-400 hover:text-white transition-colors">
                  {settings.email}
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
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
