import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../hooks';
import { toast } from 'react-toastify';
import { Header, Footer } from '../../components/common';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Đăng nhập thành công!');
      navigate('/');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: form */}
              <div className="p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 text-center leading-tight mb-10">
                  NHÀ BÁN TÁO STORE
                  <br />
                  XIN CHÀO!
                </h1>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <div className="relative">
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full px-6 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-400"
                        placeholder="Nhập email của bạn"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 ml-4">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-6 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-14 text-gray-700 placeholder:text-gray-400"
                        placeholder="Nhập mật khẩu"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-800 hover:text-blue-600 transition-colors"
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1 ml-4">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end">
                    <Link
                      to="/quen-mat-khau"
                      className="text-sm text-gray-400 hover:text-blue-800 underline transition-colors"
                    >
                      Bạn quên mật khẩu?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-900 text-white py-4 rounded-full font-semibold hover:bg-blue-950 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
                  >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                  <span>Bạn chưa có tài khoản? </span>
                  <Link to="/dang-ky" className="text-blue-800 hover:text-blue-900 font-semibold underline">
                    Đăng ký ngay
                  </Link>
                </div>
              </div>

              {/* Right: gradient design */}
              <div className="hidden lg:flex relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 items-center justify-center">
                <div className="text-center text-white p-12">
                  <div className="text-8xl mb-6">🍎</div>
                  <h2 className="text-3xl font-bold mb-4">Apple Store</h2>
                  <p className="text-lg opacity-90">Chào mừng bạn quay trở lại</p>
                  <p className="text-sm opacity-70 mt-2">Đăng nhập để tiếp tục mua sắm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
