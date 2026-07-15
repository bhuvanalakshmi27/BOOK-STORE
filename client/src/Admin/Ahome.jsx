import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import Loader from '../Components/Loader';

const Ahome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI
      .getStats()
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        {[
          { label: 'Users', value: stats?.users, color: 'primary', link: '/admin/users' },
          { label: 'Sellers', value: stats?.sellers, color: 'success', link: '/admin/sellers' },
          { label: 'Books', value: stats?.books, color: 'info', link: '/admin/books' },
          { label: 'Orders', value: stats?.orders, color: 'warning', link: '/admin/orders' },
        ].map((s) => (
          <div key={s.label} className="col-md-3 col-sm-6">
            <Link to={s.link} className="text-decoration-none">
              <div className={`card bg-${s.color} text-white shadow-sm border-0`}>
                <div className="card-body text-center py-4">
                  <h2 className="fw-bold">{s.value ?? 0}</h2>
                  <p className="mb-0">{s.label}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5>Pending Seller Approvals</h5>
              <p className="display-6 fw-bold text-warning">{stats?.pendingSellers ?? 0}</p>
              <Link to="/admin/sellers" className="btn btn-sm btn-outline-dark">Manage Sellers</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5>Total Revenue</h5>
              <p className="display-6 fw-bold text-success">${(stats?.totalRevenue ?? 0).toFixed(2)}</p>
              <Link to="/admin/orders" className="btn btn-sm btn-outline-dark">View Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ahome;
