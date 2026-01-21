import { FiRefreshCw, FiShield, FiTruck, FiCreditCard } from 'react-icons/fi';

const features = [
  {
    icon: FiRefreshCw,
    title: 'HOÀN TRẢ MIỄN PHÍ',
    description: 'Miễn phí trả hàng trong 7 ngày (trừ chính hãng Apple)',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: FiShield,
    title: 'CAM KẾT CHÍNH HÃNG',
    description: 'Hoàn tiền gấp đôi nếu phát hiện hàng giả',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: FiTruck,
    title: 'FREESHIP TOÀN QUỐC',
    description: 'Freeship cho đơn từ 300K khi thanh toán trước',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: FiCreditCard,
    title: 'HỖ TRỢ TRẢ GÓP',
    description: 'Trả góp qua thẻ tín dụng & qua app Krevido',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const Features = () => {
  return (
    <section className="py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow flex items-start gap-4"
            >
              <div className={`${feature.bgColor} p-3 rounded-full`}>
                <feature.icon className={`${feature.color}`} size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{feature.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
