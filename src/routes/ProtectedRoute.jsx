import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { Loading } from '../components/common';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
