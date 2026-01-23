import { FiLoader } from 'react-icons/fi';
import { useMemo } from 'react';

const Loading = ({ 
  size = 'md', 
  fullScreen = false,
  message = '',
  variant = 'spinner' 
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const spinner = (
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] opacity-20 blur-md"></div>
      <div
        className={`${sizeClasses[size]} relative border-[3px] border-[#EDF5E1] border-t-transparent rounded-full animate-spin`}
        style={{
          background: 'conic-gradient(from 0deg, transparent, #8EE4AF, #5CDB95, #379683, #907163, transparent)',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #fff 0)',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #fff 0)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`${size === 'sm' ? 'w-1 h-1' : 'w-2 h-2'} rounded-full bg-gradient-to-r from-[#379683] to-[#5CDB95]`}></div>
      </div>
    </div>
  );

  const dots = (
    <div className="flex items-center space-x-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const pulse = (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-[#8EE4AF] to-[#5CDB95] animate-pulse`}>
        <div className="absolute inset-2 rounded-full bg-white"></div>
      </div>
      {(size === 'lg' || size === 'xl') && (
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#379683] animate-spin"></div>
      )}
    </div>
  );

  const bar = (
    <div className={`w-32 ${size === 'sm' ? 'h-1' : size === 'md' ? 'h-1.5' : 'h-2'} bg-[#EDF5E1] rounded-full overflow-hidden`}>
      <div 
        className="h-full bg-gradient-to-r from-[#8EE4AF] via-[#5CDB95] to-[#379683] rounded-full animate-loading-bar"
        style={{ animation: 'loadingBar 1.5s ease-in-out infinite' }}
      />
    </div>
  );

  const content =
    variant === 'dots' ? dots :
    variant === 'pulse' ? pulse :
    variant === 'bar' ? bar : spinner;

  const container = (
    <div className="flex flex-col items-center justify-center gap-4">
      {content}
      {message && (
        <div className={`text-center ${textSizeClasses[size]}`}>
          <p className="text-gray-700 font-medium">{message}</p>
          <div className="flex items-center justify-center mt-2 gap-1">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="text-[#379683] animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                .
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // 🔑 RANDOM CHỈ CHẠY 1 LẦN
  const backgroundDots = useMemo(
    () =>
      Array.from({ length: 20 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: `${3 + Math.random() * 2}s`,
        delay: `${Math.random() * 2}s`,
      })),
    []
  );

  const styleTag = (
    <style jsx>{`
      @keyframes loadingBar {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
      }
      .animate-loading-bar {
        animation: loadingBar 1.5s ease-in-out infinite;
      }
    `}</style>
  );

  if (fullScreen) {
    return (
      <>
        {styleTag}
        <div className="fixed inset-0 bg-gradient-to-br from-white via-[#EDF5E1]/30 to-white backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="relative">
            <div className="absolute inset-0 -z-10">
              {backgroundDots.map((dot, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-[#8EE4AF]/30"
                  style={{
                    top: dot.top,
                    left: dot.left,
                    animation: `float ${dot.duration} infinite ease-in-out`,
                    animationDelay: dot.delay,
                  }}
                />
              ))}
            </div>

            {container}

            <div className="mt-8 opacity-30">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-[#8EE4AF] to-[#5CDB95] rounded-full"></div>
                <span className="text-sm font-bold text-[#379683]">NHÀ BÁN TÁO</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {styleTag}
      <div className="flex items-center justify-center p-8">
        {container}
      </div>
    </>
  );
};

const GlobalStyles = () => (
  <style jsx global>{`
    @keyframes float {
      0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 0.3;
      }
      50% {
        transform: translateY(-10px) scale(1.1);
        opacity: 0.6;
      }
    }
  `}</style>
);

export default Loading;
