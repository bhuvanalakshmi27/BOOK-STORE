import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <section className="hero-section text-white text-center py-5">
      <div className="container py-5">
        <h1 className="display-4 fw-bold mb-3">Welcome to BookStore</h1>
        <p className="lead mb-4">
          Discover your next favorite book from our vast collection of titles across every genre.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/user/products" className="btn btn-light btn-lg px-4">
            Browse Books
          </Link>
          <Link to="/user/signup" className="btn btn-outline-light btn-lg px-4">
            Sign Up
          </Link>
        </div>
      </div>
    </section>

    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold">How It Works</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="fs-1 mb-3">📚</div>
              <h5>Browse & Search</h5>
              <p className="text-muted">
                Explore thousands of books. Filter by genre, author, price, and rating.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="fs-1 mb-3">🛒</div>
              <h5>Add to Cart & Checkout</h5>
              <p className="text-muted">
                Add books to your cart and checkout securely with order confirmation.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="fs-1 mb-3">⭐</div>
              <h5>Review & Track</h5>
              <p className="text-muted">
                Leave reviews, track your orders, and manage your reading preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4 fw-bold">Join Our Community</h2>
        <div className="row g-4 justify-content-center">
          <div className="col-md-3">
            <Link to="/user/signup" className="btn btn-primary w-100 py-3">
              Register as User
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/seller/signup" className="btn btn-success w-100 py-3">
              Register as Seller
            </Link>
          </div>
          <div className="col-md-3">
            <Link to="/admin/signup" className="btn btn-dark w-100 py-3">
              Register as Admin
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
