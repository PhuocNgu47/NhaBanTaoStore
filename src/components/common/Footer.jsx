import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiPhone, FiMail, FiMapPin, FiHeart, FiArrowRight } from 'react-icons/fi';
import { SiZalo } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#907163] to-[#7a5a4d] text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4 group">
              <div className="relative w-12 h-12 bg-gradient-to-br from-[#8EE4AF] to-[#5CDB95] rounded-full flex items-center justify-center shadow-lg shadow-[#8EE4AF]/30 group-hover:shadow-xl group-hover:shadow-[#8EE4AF]/40 transition-all duration-300">
                <svg
                  viewBox="0 0 256 315"
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                >
                  <path 
                    d="M214 167c0 48 42 63 42 64s-7 22-22 44c-13 20-26 39-48 39-21 0-28-12-52-12s-31 12-52 12c-21 0-35-20-48-39-27-39-48-111-20-159 14-24 39-39 65-39 21 0 39 14 52 14 13 0 34-14 56-14 18 0 46 6 67 38-2 3-34 20-34 60zm-49-118c0-18 7-41 20-56 12-15 29-26 48-26 2 0 6 1 9 2-2 13-8 26-18 37-10 11-22 20-37 24-3 1-7 2-10 2-3 0-7-1-10-2-2-1-4-2-2-3z"
                    fill="white"
                  />
                </svg>
                <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-[#EDF5E1] bg-clip-text text-transparent">
                  NHÀ BÁN TÁO STORE
                </span>
                <p className="text-xs text-[#EDF5E1]/80 mt-0.5">Apple Premium Reseller</p>
              </div>
            </div>
            <p className="text-[#EDF5E1]/80 mb-6">
              Chuyên cung cấp các sản phẩm Apple chính hãng với giá tốt nhất thị trường.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-white/10 rounded-full text-[#EDF5E1] hover:bg-[#8EE4AF] hover:text-[#7a5a4d] hover:scale-110 transition-all duration-300">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full text-[#EDF5E1] hover:bg-[#5CDB95] hover:text-[#7a5a4d] hover:scale-110 transition-all duration-300">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full text-[#EDF5E1] hover:bg-[#379683] hover:text-white hover:scale-110 transition-all duration-300">
                <FiYoutube size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full text-[#EDF5E1] hover:bg-[#8EE4AF] hover:text-[#7a5a4d] hover:scale-110 transition-all duration-300">
                <SiZalo size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white border-l-4 border-[#8EE4AF] pl-3">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/gioi-thieu" className="flex items-center text-[#EDF5E1]/80 hover:text-white transition-colors duration-300 group">
                  <FiArrowRight size={16} className="text-[#8EE4AF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Giới thiệu</span>
                </Link>
              </li>
              <li>
                <Link to="/san-pham" className="flex items-center text-[#EDF5E1]/80 hover:text-white transition-colors duration-300 group">
                  <FiArrowRight size={16} className="text-[#8EE4AF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Sản phẩm</span>
                </Link>
              </li>
              <li>
                <Link to="/goc-cong-nghe" className="flex items-center text-[#EDF5E1]/80 hover:text-white transition-colors duration-300 group">
                  <FiArrowRight size={16} className="text-[#8EE4AF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Góc công nghệ</span>
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="flex items-center text-[#EDF5E1]/80 hover:text-white transition-colors duration-300 group">
                  <FiArrowRight size={16} className="text-[#8EE4AF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Liên hệ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white border-l-4 border-[#5CDB95] pl-3">Chính sách</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/chinh-sach-bao-hanh" className="flex items-center text-[#EDF5E1]/80 hover:text-white transition-colors duration-300 group">
                  <FiArrowRight size={16} className="text-[#5CDB95] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Chính sách bảo hành</span>
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach-doi-tra" className="flex items-center text-[#EDF5E1]/80 hover:text-white transition-colors duration-300 group">
                  <FiArrowRight size={16} className="text-[#5CDB95] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Chính sách đổi trả</span>
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach-van-chuyen" className="flex items-center text-[#EDF5E1]/80 hover:text-white transition-colors duration-300 group">
                  <FiArrowRight size={16} className="text-[#5CDB95] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Chính sách vận chuyển</span>
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach-bao-mat" className="flex items-center text-[#EDF5E1]/80 hover:text-white transition-colors duration-300 group">
                  <FiArrowRight size={16} className="text-[#5CDB95] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Chính sách bảo mật</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white border-l-4 border-[#379683] pl-3">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-white/10 rounded-full group-hover:bg-[#8EE4AF] group-hover:text-[#7a5a4d] transition-all duration-300">
                  <FiMapPin className="text-[#8EE4AF] group-hover:text-[#7a5a4d] flex-shrink-0" size={18} />
                </div>
                <span className="text-[#EDF5E1]/80 pt-1 group-hover:text-white transition-colors duration-300">
                  123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-white/10 rounded-full group-hover:bg-[#5CDB95] group-hover:text-[#7a5a4d] transition-all duration-300">
                  <FiPhone className="text-[#5CDB95] group-hover:text-[#7a5a4d] flex-shrink-0" size={18} />
                </div>
                <a href="tel:0123456789" className="text-[#EDF5E1]/80 hover:text-white transition-colors duration-300 group-hover:translate-x-1 transition-transform duration-300">
                  0123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-white/10 rounded-full group-hover:bg-[#379683] group-hover:text-white transition-all duration-300">
                  <FiMail className="text-[#379683] group-hover:text-white flex-shrink-0" size={18} />
                </div>
                <a href="mailto:info@anhphibantao.com" className="text-[#EDF5E1]/80 hover:text-white transition-colors duration-300 group-hover:translate-x-1 transition-transform duration-300">
                  info@anhphibantao.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#7a5a4d] border-t border-white/10">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-center text-[#EDF5E1]/80 text-sm">
              © 2026 Nhà Bán Táo Store. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[#EDF5E1]/80 text-sm">
              <FiHeart size={14} className="text-[#8EE4AF] animate-pulse" />
              <span>Made with passion for Apple lovers</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#EDF5E1]/60">Giấy phép kinh doanh: 0123456789</span>
              <span className="text-xs text-[#EDF5E1]/60">MST: 0123456789</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;