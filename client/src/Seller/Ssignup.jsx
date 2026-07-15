import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sellerAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Ssignup = () => {
  const [form, setForm] = useState({
    businessName: '', email: '', password: '', confirmPassword: '', phone: '', address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await sellerAPI.register({
        businessName: form.businessName,
        email: form.email,
        password: form.password,
        profileInfo: { phone: form.phone, address: form.address },
      });
      login('seller', data);
      navigate('/seller/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 fw-bold text-success">Seller Registration</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Business Name</label>
                  <input type="text" className="form-control" value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-control" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                  {loading ? 'Registering...' : 'Register as Seller'}
                </button>
              </form>
              <p className="text-center mt-3 mb-0">
                Already registered? <Link to="/seller/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ssignup;
