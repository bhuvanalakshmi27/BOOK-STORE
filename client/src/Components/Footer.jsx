import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-dark text-white py-5 mt-auto">
    <div className="container">
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <h5 className="fw-bold mb-3">BookStore</h5>
          <p className="text-white-50 small mb-0">
            Your one-stop shop for books. Browse, discover, and purchase from thousands of titles.
          </p>
        </div>
        <div className="col-12 col-md-4">
          <h6 className="fw-semibold mb-3">Quick Links</h6>
          <ul className="list-unstyled small d-grid gap-2 mb-0">
            <li><Link to="/" className="text-white-50 text-decoration-none">Home</Link></li>
            <li><Link to="/user/products" className="text-white-50 text-decoration-none">Browse Books</Link></li>
            <li><Link to="/seller/signup" className="text-white-50 text-decoration-none">Become a Seller</Link></li>
          </ul>
        </div>
        <div className="col-12 col-md-4">
          <h6 className="fw-semibold mb-3">Contact</h6>
          <p className="text-white-50 small mb-2">support@bookstore.com</p>
          <p className="text-white-50 small mb-0">© 2026 BookStore. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
