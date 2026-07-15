import { Link } from 'react-router-dom';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

const OrderItem = ({ order }) => (
  <div className="card shadow-sm border-0 mb-3">
    <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div>
        <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
        <span className="text-muted ms-3 small">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>
      <span className={`badge bg-${statusColors[order.status] || 'secondary'}`}>
        {order.status}
      </span>
    </div>
    <div className="card-body">
      {order.items.map((item, idx) => (
        <div key={idx} className="d-flex justify-content-between py-2 border-bottom">
          <span>{item.title} x {item.quantity}</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="d-flex justify-content-between mt-3">
        <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
        <Link to={`/user/orders/${order._id}`} className="btn btn-sm btn-outline-primary">
          View Details
        </Link>
      </div>
    </div>
  </div>
);

export default OrderItem;
