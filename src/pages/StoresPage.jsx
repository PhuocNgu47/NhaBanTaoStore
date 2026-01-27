import { FiMapPin, FiPhone, FiClock, FiNavigation } from 'react-icons/fi';
import BannerSlider from '../components/home/BannerSlider';

const stores = [
    {
        id: 1,
        city: "Hà Nội",
        image: "https://anhphibantao.com/_next/image?url=https%3A%2F%2Fanhphibantao.com%2Fbe%2Fuploads%2Fstore%2F1753867535592-871004833.webp&w=1920&q=75",
        address: "256 Đ. Nghi Tàm, Yên Phụ, Tây Hồ, Hà Nội",
        time: "8:30 - 21:30",
        hotline: "0815242433",
        mapLink: "https://www.google.com/maps/search/?api=1&query=256+Đ.+Nghi+Tàm,+Yên+Phụ,+Tây+Hồ,+Hà+Nội"
    },
    {
        id: 2,
        city: "Hồ Chí Minh",
        image: "https://anhphibantao.com/_next/image?url=https%3A%2F%2Fanhphibantao.com%2Fbe%2Fuploads%2Fstore%2F1753867535593-530594898.webp&w=1920&q=75",
        address: "214/8 Nguyễn Oanh, Phường 17, Gò Vấp, Hồ Chí Minh",
        time: "8:30 - 21:30",
        hotline: "0886815969",
        mapLink: "https://www.google.com/maps/search/?api=1&query=214/8+Nguyễn+Oanh,+Phường+17,+Gò+Vấp,+Hồ+Chí+Minh"
    },
];

export default function StoresPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <BannerSlider />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-blue-900 mb-4 tracking-tight">
                            HỆ THỐNG CỬA HÀNG
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Ghé thăm các chi nhánh của chúng tôi để trải nghiệm sản phẩm trực tiếp và nhận sự tư vấn tận tình.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {stores.map((store) => (
                            <div
                                key={store.id}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                            >
                                <div className="relative h-64 overflow-hidden group">
                                    <img
                                        src={store.image}
                                        alt={`Cửa hàng ${store.city}`}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                        <h2 className="text-3xl font-bold text-white p-6 drop-shadow-md">
                                            {store.city}
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-start gap-4 text-gray-700">
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                                                <FiMapPin size={24} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Địa chỉ</p>
                                                <p>{store.address}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-gray-700">
                                            <div className="p-2 bg-green-100 rounded-lg text-green-600 shrink-0">
                                                <FiClock size={24} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Giờ mở cửa</p>
                                                <p>{store.time}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-gray-700">
                                            <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
                                                <FiPhone size={24} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Hotline</p>
                                                <a href={`tel:${store.hotline}`} className="hover:text-red-600 transition-colors">
                                                    {store.hotline}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <a
                                            href={store.mapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg hover:shadow-blue-200/50"
                                        >
                                            <FiNavigation className="text-xl" />
                                            Chỉ đường đến cửa hàng
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
}
