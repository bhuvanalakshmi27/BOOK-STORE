import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../Components/Loader';

const Uitem = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, reviewsRes] = await Promise.all([
          userAPI.getBook(id),
          userAPI.getReviews(id),
        ]);
        setBook(bookRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load book');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setSuccess('Added to cart!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'user') {
      setError('Please login as a user to leave a review');
      return;
    }
    try {
      await userAPI.addReview({ bookId: id, ...reviewForm });
      const { data } = await userAPI.getReviews(id);
      setReviews(data);
      const { data: updatedBook } = await userAPI.getBook(id);
      setBook(updatedBook);
      setReviewForm({ rating: 5, comment: '' });
      setSuccess('Review submitted!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <Loader />;
  if (!book) return <div className="container py-5"><div className="alert alert-danger">{error || 'Book not found'}</div></div>;

  return (
    <div className="container py-4">
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-md-4">
          {book.image ? (
            <img src={book.image} alt={book.title} className="img-fluid rounded shadow book-detail-img" />
          ) : (
            <div className="book-detail-placeholder">📖</div>
          )}
        </div>
        <div className="col-md-8">
          <h2 className="fw-bold">{book.title}</h2>
          <p className="text-muted">by {book.authors?.join(', ')}</p>
          <div className="mb-3">
            {book.genres?.map((g) => (
              <span key={g} className="badge bg-primary me-1">{g}</span>
            ))}
          </div>
          <p className="lead">${book.price.toFixed(2)}</p>
          <p>
            <span className="text-warning">{'⭐'.repeat(Math.round(book.averageRating))}</span>
            <span className="text-muted ms-2">({book.reviewCount} reviews)</span>
          </p>
          <p>{book.description}</p>
          <p className="text-muted">Stock: {book.stock} available</p>
          {book.sellerId && (
            <p className="text-muted small">Sold by: {book.sellerId.businessName}</p>
          )}

          <div className="d-flex align-items-center gap-3 mt-4">
            <div className="d-flex align-items-center">
              <label className="me-2">Qty:</label>
              <input
                type="number"
                className="form-control form-control-sm"
                style={{ width: '70px' }}
                min={1}
                max={book.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={book.stock === 0}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <hr className="my-5" />

      <div className="row">
        <div className="col-md-6">
          <h4 className="fw-bold mb-3">Reviews</h4>
          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="border-bottom py-3">
                <div className="d-flex justify-content-between">
                  <strong>{r.userId?.name || 'Anonymous'}</strong>
                  <span className="text-warning">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="mb-0 mt-1">{r.comment}</p>
              </div>
            ))
          )}
        </div>
        {user?.role === 'user' && (
          <div className="col-md-6">
            <h4 className="fw-bold mb-3">Write a Review</h4>
            <form onSubmit={handleReview}>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <select
                  className="form-select"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Stars</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-outline-primary">Submit Review</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Uitem;
