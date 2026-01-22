import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiHome, FiChevronRight, FiCheck, FiMail } from 'react-icons/fi';
import { useAuth } from '../../hooks';
import { toast } from 'react-toastify';
import { Header, Footer } from '../../components/common';

// Step 1: Email verification schema
const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

// Step 2: Full registration schema
const registerSchema = z
  .object({
    name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

const RegisterPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Verification countdown, 3: Full form
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const { register: registerUser, isLoading, error } = useAuth();
  const navigate = useNavigate();

  // Email form
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
  });

  // Registration form
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle email verification request
  const onEmailSubmit = (data) => {
    setEmail(data.email);
    setCountdown(60);
    setStep(2);
    toast.info('Đã gửi email xác minh! (Giả lập)');
  };

  // Simulate email verification
  const handleSimulateVerify = () => {
    setIsVerified(true);
    setCountdown(0);
    setStep(3);
    toast.success('Email đã được xác minh thành công!');
  };

  // Handle full registration
  const onRegisterSubmit = async (data) => {
    const fullData = { ...data, email };
    const result = await registerUser(fullData);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Đăng ký thành công!');
      navigate('/');
    }
  };

  // Format countdown to mm:ss
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-blue-800 transition-colors">
              <FiHome className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-800 font-medium">Đăng Ký</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-[calc(100vh-300px)] py-10">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Right: gradient design */}
              <div className="hidden lg:flex relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 items-center justify-center">
                <div className="text-center text-white p-12">
                  <div className="text-8xl mb-6">🍎</div>
                  <h2 className="text-3xl font-bold mb-4">Apple Store</h2>
                  <p className="text-lg opacity-90">Tham gia cùng chúng tôi</p>
                  <p className="text-sm opacity-70 mt-2">Đăng ký để nhận ưu đãi đặc biệt</p>
                </div>
              </div>

              {/* Right: Form */}
              <div className="p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
                {/* Step 1: Email Input */}
                {step === 1 && (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800 text-center leading-tight mb-10">
                      ĐĂNG KÝ TÀI KHOẢN TẠI
                      <br />
                      NHÀ BÁN TÁO STORE!
                    </h1>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                      </div>
                    )}

                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                      <div>
                        <input
                          {...emailForm.register('email')}
                          type="email"
                          className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-400"
                          placeholder="Email"
                        />
                        {emailForm.formState.errors.email && (
                          <p className="text-red-500 text-sm mt-1 ml-2">
                            {emailForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-900 text-white py-4 rounded-full font-semibold hover:bg-blue-950 transition-colors text-lg"
                      >
                        Xác minh email
                      </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                      <span>Bạn đã có tài khoản? </span>
                      <Link to="/dang-nhap" className="text-blue-800 hover:text-blue-900 font-semibold underline">
                        Đăng nhập ngay
                      </Link>
                    </div>
                  </>
                )}

                {/* Step 2: Verification Countdown */}
                {step === 2 && (
                  <>
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMail className="w-10 h-10 text-blue-800" />
                      </div>
                      <h1 className="text-2xl font-bold text-blue-800 mb-2">
                        Xác minh email của bạn
                      </h1>
                      <p className="text-gray-500 text-sm">
                        Chúng tôi đã gửi email xác minh đến
                      </p>
                      <p className="text-blue-800 font-semibold mt-1">{email}</p>
                    </div>

                    {/* Countdown */}
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-blue-900 mb-2">
                        {formatCountdown(countdown)}
                      </div>
                      <p className="text-gray-500 text-sm">
                        Thời gian còn lại để xác minh
                      </p>
                    </div>

                    {/* Simulate Verification Button */}
                    <button
                      onClick={handleSimulateVerify}
                      className="w-full bg-green-600 text-white py-4 rounded-full font-semibold hover:bg-green-700 transition-colors text-lg flex items-center justify-center gap-2 mb-4"
                    >
                      <FiCheck className="w-5 h-5" />
                      Giả lập đã xác nhận email
                    </button>

                    {/* Resend button */}
                    <button
                      onClick={() => {
                        setCountdown(60);
                        toast.info('Đã gửi lại email xác minh!');
                      }}
                      disabled={countdown > 0}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại email xác minh'}
                    </button>

                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setStep(1)}
                        className="text-blue-800 hover:text-blue-900 text-sm underline"
                      >
                        Thay đổi email
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3: Full Registration Form */}
                {step === 3 && (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiCheck className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-green-600 font-medium text-sm">Email đã xác minh</p>
                      <p className="text-blue-800 font-semibold">{email}</p>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
                      Hoàn tất thông tin đăng ký
                    </h2>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                      </div>
                    )}

                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <div>
                        <input
                          {...registerForm.register('name')}
                          type="text"
                          className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder:text-gray-400"
                          placeholder="Họ và tên"
                        />
                        {registerForm.formState.errors.name && (
                          <p className="text-red-500 text-sm mt-1 ml-2">
                            {registerForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          {...registerForm.register('phone')}
                          type="tel"
                          className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder:text-gray-400"
                          placeholder="Số điện thoại"
                        />
                        {registerForm.formState.errors.phone && (
                          <p className="text-red-500 text-sm mt-1 ml-2">
                            {registerForm.formState.errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          {...registerForm.register('password')}
                          type="password"
                          className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder:text-gray-400"
                          placeholder="Mật khẩu"
                        />
                        {registerForm.formState.errors.password && (
                          <p className="text-red-500 text-sm mt-1 ml-2">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          {...registerForm.register('confirmPassword')}
                          type="password"
                          className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder:text-gray-400"
                          placeholder="Xác nhận mật khẩu"
                        />
                        {registerForm.formState.errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1 ml-2">
                            {registerForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-900 text-white py-4 rounded-full font-semibold hover:bg-blue-950 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
                      >
                        {isLoading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RegisterPage;
