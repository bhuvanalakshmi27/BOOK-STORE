import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          📖 BookStore
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user/products">Books</Link>
            </li>
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/login">User Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/seller/login">Seller Login</Link>
                </li>
              </>
            )}
            {user?.role === 'user' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/home">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/orders">My Orders</Link>
                </li>
              </>
            )}
            {user?.role === 'seller' && (
              <li className="nav-item">
                <Link className="nav-link" to="/seller/home">Seller Dashboard</Link>
              </li>
            )}
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/home">Admin Dashboard</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {user?.role === 'user' && (
              <li className="nav-item">
                <Link className="nav-link position-relative" to="/user/home">
                  🛒 Cart
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            )}
            {user ? (
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-outline-light btn-sm ms-2" to="/user/signup">
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
