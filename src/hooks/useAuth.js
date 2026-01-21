import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout, clearError } from '../features/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    return dispatch(login(credentials));
  };

  const handleRegister = async (userData) => {
    return dispatch(register(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: handleClearError,
  };
};
