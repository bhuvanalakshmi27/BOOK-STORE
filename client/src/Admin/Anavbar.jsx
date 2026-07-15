import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Anavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/admin/home">⚙️ Admin Panel</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/admin/home">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin/users">Users</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin/sellers">Sellers</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin/books">Books</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin/orders">Orders</Link></li>
          </ul>
          <span className="text-light me-3 small">{user?.name}</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Anavbar;
