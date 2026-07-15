import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Shome = () => {
  const { user } = useAuth();

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-2">Seller Dashboard</h2>
      <p className="text-muted mb-4">Welcome, {user?.businessName}</p>

      {!user?.isApproved && (
        <div className="alert alert-warning">
          Your seller account is pending admin approval. You won't be able to list books until approved.
        </div>
      )}

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100 text-center p-4">
            <div className="fs-1 mb-3">📚</div>
            <h5>My Products</h5>
            <p className="text-muted">Manage your book listings</p>
            <Link to="/seller/products" className="btn btn-success">View Products</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100 text-center p-4">
            <div className="fs-1 mb-3">➕</div>
            <h5>Add New Book</h5>
            <p className="text-muted">List a new book for sale</p>
            <Link to="/seller/add-book" className="btn btn-outline-success">Add Book</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100 text-center p-4">
            <div className="fs-1 mb-3">📦</div>
            <h5>Orders</h5>
            <p className="text-muted">View and fulfill customer orders</p>
            <Link to="/seller/orders" className="btn btn-outline-success">View Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shome;
