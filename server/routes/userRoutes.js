const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getBooks,
  getBookById,
  placeOrder,
  getUserOrders,
  getOrderById,
  addReview,
  getBookReviews,
  getFilters,
} = require('../controllers/UsersController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/books', getBooks);
router.get('/books/:id/reviews', getBookReviews);
router.get('/books/:id', getBookById);
router.get('/filters', getFilters);

// Protected user routes
router
  .route('/profile')
  .get(protect, authorizeRoles('user'), getUserProfile)
  .put(protect, authorizeRoles('user'), updateUserProfile);

router
  .route('/orders')
  .get(protect, authorizeRoles('user'), getUserOrders)
  .post(protect, authorizeRoles('user'), placeOrder);

router.get('/orders/:id', protect, authorizeRoles('user'), getOrderById);
router.post('/reviews', protect, authorizeRoles('user'), addReview);

module.exports = router;
