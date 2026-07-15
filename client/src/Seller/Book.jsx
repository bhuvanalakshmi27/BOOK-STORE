import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sellerAPI } from '../utils/api';
import Loader from '../Components/Loader';

const Book = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    sellerAPI
      .getBooks()
      .then(({ data }) => {
        const book = data.find((b) => b._id === id);
        if (book) {
          setForm({
            title: book.title,
            authors: book.authors?.join(', ') || '',
            genres: book.genres?.join(', ') || '',
            description: book.description,
            price: book.price,
            stock: book.stock,
          });
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load book'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('authors', JSON.stringify(form.authors.split(',').map((a) => a.trim()).filter(Boolean)));
    formData.append('genres', JSON.stringify(form.genres.split(',').map((g) => g.trim()).filter(Boolean)));
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    if (image) formData.append('image', image);

    try {
      await sellerAPI.updateBook(id, formData);
      navigate('/seller/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!form) return <div className="container py-5"><div className="alert alert-danger">{error || 'Book not found'}</div></div>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Edit Book</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Title</label>
                <input className="form-control" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Authors</label>
                <input className="form-control" value={form.authors}
                  onChange={(e) => setForm({ ...form, authors: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Genres</label>
                <input className="form-control" value={form.genres}
                  onChange={(e) => setForm({ ...form, genres: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Price</label>
                <input type="number" step="0.01" className="form-control" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Stock</label>
                <input type="number" className="form-control" value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={4} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">New Cover Image (optional)</label>
                <input type="file" className="form-control" accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])} />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-4" disabled={saving}>
              {saving ? 'Saving...' : 'Update Book'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Book;
