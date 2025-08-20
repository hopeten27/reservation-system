import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const { showError } = useToast();

  useEffect(() => {
    if (requireAdmin && isAuthenticated && user?.role !== 'admin') {
      showError('Access denied. Admin privileges required.');
    }
  }, [requireAdmin, isAuthenticated, user, showError]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;