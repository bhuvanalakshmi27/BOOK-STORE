import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import Loader from '../Components/Loader';

const Items = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    adminAPI
      .getBooks()
      .then(({ data }) => setBooks(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load books'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book listing?')) return;
    try {
      await adminAPI.deleteBook(id);
      setBooks(books.filter((b) => b._id !== id));
      setSuccess('Book deleted');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Manage Books</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Seller</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.authors?.join(', ')}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>{book.stock}</td>
                <td>{book.sellerId?.businessName || 'N/A'}</td>
                <td>{book.averageRating} ({book.reviewCount})</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(book._id)}>
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

export default Items;
