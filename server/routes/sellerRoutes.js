const express = require('express');
const {
  registerSeller,
  loginSeller,
  getSellerProfile,
  updateSellerProfile,
  addBook,
  updateBook,
  deleteBook,
  getSellerBooks,
  getSellerOrders,
  fulfillOrder,
} = require('../controllers/SellerControllers');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

const router = express.Router();

// Public routes
router.post('/register', registerSeller);
router.post('/login', loginSeller);

// Protected seller routes
router
  .route('/profile')
  .get(protect, authorizeRoles('seller'), getSellerProfile)
  .put(protect, authorizeRoles('seller'), updateSellerProfile);

router
  .route('/books')
  .get(protect, authorizeRoles('seller'), getSellerBooks)
  .post(protect, authorizeRoles('seller'), upload.single('image'), addBook);

router
  .route('/books/:id')
  .put(protect, authorizeRoles('seller'), upload.single('image'), updateBook)
  .delete(protect, authorizeRoles('seller'), deleteBook);

router.get('/orders', protect, authorizeRoles('seller'), getSellerOrders);
router.put('/orders/:id/fulfill', protect, authorizeRoles('seller'), fulfillOrder);

module.exports = router;
