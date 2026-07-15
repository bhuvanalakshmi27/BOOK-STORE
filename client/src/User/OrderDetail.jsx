import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../utils/api';
import Loader from '../Components/Loader';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    userAPI
      .getOrder(id)
      .then(({ data }) => setOrder(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container py-4">
      <Link to="/user/orders" className="btn btn-link mb-3">← Back to Orders</Link>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h4 className="mb-0">Order #{order._id.slice(-8).toUpperCase()}</h4>
          <span className="badge bg-primary mt-2">{order.status}</span>
        </div>
        <div className="card-body">
          <p className="text-muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          <hr />
          {order.items.map((item, idx) => (
            <div key={idx} className="d-flex justify-content-between py-2 border-bottom">
              <span>{item.title} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="d-flex justify-content-between mt-3">
            <strong>Total</strong>
            <strong className="text-primary">${order.totalPrice.toFixed(2)}</strong>
          </div>
          {order.shippingAddress && (
            <>
              <hr />
              <h6>Shipping Address</h6>
              <p className="text-muted mb-0">
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
