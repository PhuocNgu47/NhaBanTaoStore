import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout, clearError } from '../features/authSlice';
import { clearCart } from '../features/cartSlice';
import { getUserContactInfo as getContactInfo } from '../utils/helpers';

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
    // CRITICAL: Complete logout sequence
    // 1. Clear cart state first (prevents cart persistence)
    dispatch(clearCart());
    
    // 2. Clear auth state and localStorage
    dispatch(logout());
    
    // 3. Clear any additional user-related data
    // Note: removeToken() and removeUser() are called inside logout reducer
    // Cart is already cleared by clearCart action above
    
    // Optional: Clear guestId for complete reset (uncomment if needed)
    // localStorage.removeItem('guestId');
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const isAdmin = user?.role === 'admin';

  // Helper function for checkout auto-fill
  const getUserContactInfo = () => {
    // Priority 1: Use current Redux state user
    if (user) {
      return {
        email: user.email || '',
        phone: user.phone || '',
        name: user.name || '',
      };
    }
    
    // Priority 2: Fallback to localStorage
    return getContactInfo();
  };

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
    getUserContactInfo, // Export helper for checkout auto-fill
  };
};
