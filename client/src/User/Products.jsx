import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../utils/api';
import Loader from '../Components/Loader';

const Products = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ genres: [], authors: [] });
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (genre) params.genre = genre;
      if (author) params.author = author;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minRating) params.minRating = minRating;

      const { data } = await userAPI.getBooks(params);
      setBooks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userAPI.getFilters().then(({ data }) => setFilters(data)).catch(() => {});
    fetchBooks();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const clearFilters = async () => {
    setSearch('');
    setGenre('');
    setAuthor('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setLoading(true);
    try {
      const { data } = await userAPI.getBooks({});
      setBooks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Browse Books</h2>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <form onSubmit={handleFilter} className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title, author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="">All Genres</option>
                {filters.genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={author} onChange={(e) => setAuthor(e.target.value)}>
                <option value="">All Authors</option>
                {filters.authors.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="col-md-1">
              <input
                type="number"
                className="form-control"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="col-md-1">
              <input
                type="number"
                className="form-control"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="col-md-1">
              <select className="form-select" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                <option value="">Rating</option>
                {[4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r}+ ⭐</option>
                ))}
              </select>
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-primary w-100">Filter</button>
            </div>
          </form>
          <button className="btn btn-link btn-sm mt-2 p-0" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <Loader message="Loading books..." />
      ) : books.length === 0 ? (
        <p className="text-center text-muted py-5">No books found matching your criteria.</p>
      ) : (
        <div className="row g-4">
          {books.map((book) => (
            <div key={book._id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0 book-card">
                {book.image ? (
                  <img src={book.image} className="card-img-top book-img" alt={book.title} />
                ) : (
                  <div className="book-img-placeholder">📖</div>
                )}
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold">{book.title}</h6>
                  <p className="text-muted small mb-1">{book.authors?.join(', ')}</p>
                  <div className="mb-2">
                    {book.genres?.slice(0, 2).map((g) => (
                      <span key={g} className="badge bg-light text-dark me-1">{g}</span>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="fw-bold text-primary">${book.price.toFixed(2)}</span>
                    <span className="small text-warning">
                      {'⭐'.repeat(Math.round(book.averageRating))} ({book.reviewCount})
                    </span>
                  </div>
                  <Link to={`/user/book/${book._id}`} className="btn btn-outline-primary btn-sm mt-2">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
