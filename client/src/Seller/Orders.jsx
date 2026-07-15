import { useState, useEffect } from 'react';
import { sellerAPI } from '../utils/api';
import Loader from '../Components/Loader';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchOrders = () => {
    sellerAPI
      .getOrders()
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await sellerAPI.fulfillOrder(orderId, status);
      setSuccess('Order status updated');
      fetchOrders();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
    }
  };

  if (loading) return <Loader message="Loading orders..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Incoming Orders</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {orders.length === 0 ? (
        <p className="text-muted text-center py-5">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card shadow-sm border-0 mb-3">
            <div className="card-header bg-white d-flex justify-content-between flex-wrap gap-2">
              <div>
                <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                <span className="text-muted ms-2 small">
                  {order.userId?.name} — {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="card-body">
              {order.items.map((item, idx) => (
                <div key={idx} className="d-flex justify-content-between py-1">
                  <span>{item.title} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
