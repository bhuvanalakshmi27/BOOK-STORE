import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const role = localStorage.getItem('role');
  const tokenKey = role ? `${role}Token` : null;
  const token = tokenKey ? localStorage.getItem(tokenKey) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuth = (role, data) => {
  localStorage.setItem('role', role);
  localStorage.setItem(`${role}Token`, data.token);
  localStorage.setItem(`${role}Info`, JSON.stringify(data));
};

export const clearAuth = () => {
  const role = localStorage.getItem('role');
  if (role) {
    localStorage.removeItem(`${role}Token`);
    localStorage.removeItem(`${role}Info`);
  }
  localStorage.removeItem('role');
};

export const getAuth = () => {
  const role = localStorage.getItem('role');
  if (!role) return null;
  const info = localStorage.getItem(`${role}Info`);
  return info ? { role, ...JSON.parse(info) } : null;
};

// User API
export const userAPI = {
  register: (data) => API.post('/users/register', data),
  login: (data) => API.post('/users/login', data),
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  getBooks: (params) => API.get('/users/books', { params }),
  getBook: (id) => API.get(`/users/books/${id}`),
  getFilters: () => API.get('/users/filters'),
  placeOrder: (data) => API.post('/users/orders', data),
  getOrders: () => API.get('/users/orders'),
  getOrder: (id) => API.get(`/users/orders/${id}`),
  addReview: (data) => API.post('/users/reviews', data),
  getReviews: (bookId) => API.get(`/users/books/${bookId}/reviews`),
};

// Seller API
export const sellerAPI = {
  register: (data) => API.post('/sellers/register', data),
  login: (data) => API.post('/sellers/login', data),
  getProfile: () => API.get('/sellers/profile'),
  updateProfile: (data) => API.put('/sellers/profile', data),
  getBooks: () => API.get('/sellers/books'),
  addBook: (formData) =>
    API.post('/sellers/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateBook: (id, formData) =>
    API.put(`/sellers/books/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteBook: (id) => API.delete(`/sellers/books/${id}`),
  getOrders: () => API.get('/sellers/orders'),
  fulfillOrder: (id, status) => API.put(`/sellers/orders/${id}/fulfill`, { status }),
};

// Admin API
export const adminAPI = {
  register: (data) => API.post('/admin/register', data),
  login: (data) => API.post('/admin/login', data),
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getSellers: () => API.get('/admin/sellers'),
  updateSeller: (id, data) => API.put(`/admin/sellers/${id}`, data),
  deleteSeller: (id) => API.delete(`/admin/sellers/${id}`),
  getBooks: () => API.get('/admin/books'),
  deleteBook: (id) => API.delete(`/admin/books/${id}`),
  getOrders: () => API.get('/admin/orders'),
  updateOrder: (id, data) => API.put(`/admin/orders/${id}`, data),
};

export default API;
