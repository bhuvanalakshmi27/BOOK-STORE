import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sellerAPI } from '../utils/api';
import Loader from '../Components/Loader';
import './List.css';

const MyProducts = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooks = () => {
    sellerAPI
      .getBooks()
      .then(({ data }) => setBooks(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load books'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book listing?')) return;
    try {
      await sellerAPI.deleteBook(id);
      setBooks(books.filter((b) => b._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">My Products</h2>
        <Link to="/seller/add-book" className="btn btn-success">+ Add Book</Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      {books.length === 0 ? (
        <p className="text-muted text-center py-5">No products listed yet.</p>
      ) : (
        <div className="row g-4">
          {books.map((book) => (
            <div key={book._id} className="col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0 seller-book-card">
                {book.image ? (
                  <img src={book.image} className="card-img-top" alt={book.title} />
                ) : (
                  <div className="seller-book-placeholder">📖</div>
                )}
                <div className="card-body">
                  <h6 className="fw-bold">{book.title}</h6>
                  <p className="text-muted small">{book.authors?.join(', ')}</p>
                  <p className="fw-bold text-success">${book.price.toFixed(2)}</p>
                  <p className="small text-muted">Stock: {book.stock}</p>
                  <div className="d-flex gap-2">
                    <Link to={`/seller/book/${book._id}`} className="btn btn-sm btn-outline-success flex-grow-1">
                      Edit
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(book._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
