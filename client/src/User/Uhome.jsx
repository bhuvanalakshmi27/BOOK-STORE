import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';

const Uhome = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const [shipping, setShipping] = useState({
    street: '', city: '', state: '', zipCode: '', country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }
    if (!shipping.street || !shipping.city || !shipping.zipCode) {
      setError('Please fill in shipping address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await userAPI.placeOrder({
        items: cart.map((item) => ({ bookId: item.bookId, quantity: item.quantity })),
        shippingAddress: shipping,
      });
      clearCart();
      setSuccess(`Order placed successfully! Order ID: ${data._id}`);
      setTimeout(() => navigate(`/user/orders/${data._id}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Welcome, {user?.name}!</h2>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Shopping Cart ({cart.length} items)</h5>
              <Link to="/user/products" className="btn btn-sm btn-outline-primary">
                Continue Shopping
              </Link>
            </div>
            <div className="card-body">
              {cart.length === 0 ? (
                <p className="text-muted text-center py-4">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.bookId} className="d-flex align-items-center border-bottom py-3 gap-3">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="cart-thumb" />
                    ) : (
                      <div className="cart-thumb-placeholder">📖</div>
                    )}
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.title}</h6>
                      <p className="text-muted mb-0">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromCart(item.bookId)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <h5 className="mb-0">Checkout</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Street</label>
                <input
                  className="form-control form-control-sm"
                  value={shipping.street}
                  onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">City</label>
                <input
                  className="form-control form-control-sm"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                />
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label">State</label>
                  <input
                    className="form-control form-control-sm"
                    value={shipping.state}
                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Zip</label>
                  <input
                    className="form-control form-control-sm"
                    value={shipping.zipCode}
                    onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Country</label>
                <input
                  className="form-control form-control-sm"
                  value={shipping.country}
                  onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                />
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-primary">${cartTotal.toFixed(2)}</strong>
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uhome;
