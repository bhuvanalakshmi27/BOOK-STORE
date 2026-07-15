import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) {
    if (role === 'admin') return <Navigate to="/admin/login" />;
    if (role === 'seller') return <Navigate to="/seller/login" />;
    return <Navigate to="/user/login" />;
  }

  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin/home" />;
    if (user.role === 'seller') return <Navigate to="/seller/home" />;
    return <Navigate to="/user/home" />;
  }

  return children;
};

export default PrivateRoute;
