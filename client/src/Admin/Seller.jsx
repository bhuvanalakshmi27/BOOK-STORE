import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import Loader from '../Components/Loader';

const Seller = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSellers = () => {
    adminAPI
      .getSellers()
      .then(({ data }) => setSellers(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load sellers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSellers(); }, []);

  const handleApprove = async (id, isApproved) => {
    try {
      await adminAPI.updateSeller(id, { isApproved });
      setSellers(sellers.map((s) => (s._id === id ? { ...s, isApproved } : s)));
      setSuccess(isApproved ? 'Seller approved' : 'Seller approval revoked');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update seller');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this seller and all their books?')) return;
    try {
      await adminAPI.deleteSeller(id);
      setSellers(sellers.filter((s) => s._id !== id));
      setSuccess('Seller deleted');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete seller');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Manage Sellers</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>Business</th>
              <th>Email</th>
              <th>Status</th>
              <th>Books</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id}>
                <td>{seller.businessName}</td>
                <td>{seller.email}</td>
                <td>
                  <span className={`badge bg-${seller.isApproved ? 'success' : 'warning'}`}>
                    {seller.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>{seller.listedBooks?.length || 0}</td>
                <td className="d-flex gap-2">
                  {!seller.isApproved ? (
                    <button className="btn btn-sm btn-success" onClick={() => handleApprove(seller._id, true)}>
                      Approve
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-warning" onClick={() => handleApprove(seller._id, false)}>
                      Revoke
                    </button>
                  )}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(seller._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Seller;
