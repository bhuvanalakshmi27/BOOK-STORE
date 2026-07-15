const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  getStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllSellers,
  updateSeller,
  deleteSeller,
  getAllBooks,
  deleteBook,
  getAllOrders,
  updateOrder,
} = require('../controllers/AdminControllers');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected admin routes
router.get('/stats', protect, authorizeRoles('admin'), getStats);

router.route('/users').get(protect, authorizeRoles('admin'), getAllUsers);
router
  .route('/users/:id')
  .put(protect, authorizeRoles('admin'), updateUser)
  .delete(protect, authorizeRoles('admin'), deleteUser);

router.route('/sellers').get(protect, authorizeRoles('admin'), getAllSellers);
router
  .route('/sellers/:id')
  .put(protect, authorizeRoles('admin'), updateSeller)
  .delete(protect, authorizeRoles('admin'), deleteSeller);

router.route('/books').get(protect, authorizeRoles('admin'), getAllBooks);
router.delete('/books/:id', protect, authorizeRoles('admin'), deleteBook);

router.route('/orders').get(protect, authorizeRoles('admin'), getAllOrders);
router.put('/orders/:id', protect, authorizeRoles('admin'), updateOrder);

module.exports = router;
