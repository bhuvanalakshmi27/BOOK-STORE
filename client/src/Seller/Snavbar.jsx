import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Snavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/seller/home">🏪 Seller Portal</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sellerNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="sellerNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/seller/home">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/seller/products">My Products</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/seller/add-book">Add Book</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/seller/orders">Orders</Link></li>
          </ul>
          <span className="text-light me-3 small">{user?.businessName}</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Snavbar;
