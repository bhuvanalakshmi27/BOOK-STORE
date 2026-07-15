import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../utils/api';
import Loader from '../Components/Loader';
import OrderItem from './OrderItem';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    userAPI
      .getOrders()
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Loading orders..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">My Orders</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link to="/user/products" className="btn btn-primary">Browse Books</Link>
        </div>
      ) : (
        orders.map((order) => <OrderItem key={order._id} order={order} />)
      )}
    </div>
  );
};

export default MyOrders;
