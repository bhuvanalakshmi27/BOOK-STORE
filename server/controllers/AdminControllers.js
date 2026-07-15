const Admin = require('../models/Admin/adminModel');
const User = require('../models/Users/userModel');
const Seller = require('../models/Seller/sellerModel');
const Book = require('../models/Seller/bookModel');
const Order = require('../models/Users/orderModel');
const fs = require('fs');
const path = require('path');
const { generateToken } = require('../middlewares/authMiddleware');

const errorLogFile = path.join(__dirname, '..', 'logs', 'server-errors.log');

const logControllerError = (scope, error) => {
  const errorText = error && error.stack ? error.stack : String(error);
  const entry = `[${new Date().toISOString()}] [AdminControllers:${scope}] ${errorText}\n\n`;

  try {
    fs.mkdirSync(path.dirname(errorLogFile), { recursive: true });
    fs.appendFileSync(errorLogFile, entry, 'utf8');
  } catch (logError) {
    console.error('Failed to write admin controller error log:', logError);
  }
};

// Register a new admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, 'admin'),
    });
  } catch (error) {
    logControllerError('registerAdmin', error);
    res.status(500).json({ message: error.message });
  }
};

// Login an admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id, 'admin'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    logControllerError('loginAdmin', error);
    res.status(500).json({ message: error.message });
  }
};

// Get system stats
const getStats = async (req, res) => {
  try {
    const [userCount, sellerCount, bookCount, orderCount, pendingSellers, totalRevenue] =
      await Promise.all([
        User.countDocuments(),
        Seller.countDocuments(),
        Book.countDocuments(),
        Order.countDocuments(),
        Seller.countDocuments({ isApproved: false }),
        Order.aggregate([
          { $match: { status: { $ne: 'cancelled' } } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),
      ]);

    res.json({
      users: userCount,
      sellers: sellerCount,
      books: bookCount,
      orders: orderCount,
      pendingSellers,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    logControllerError('getStats', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    logControllerError('getAllUsers', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.preferences) {
      user.preferences = { ...user.preferences.toObject(), ...req.body.preferences };
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      preferences: updatedUser.preferences,
    });
  } catch (error) {
    logControllerError('updateUser', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logControllerError('deleteUser', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all sellers
const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({}).select('-password').sort({ createdAt: -1 });
    res.json(sellers);
  } catch (error) {
    logControllerError('getAllSellers', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a seller
const updateSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    if (req.body.isApproved !== undefined) seller.isApproved = req.body.isApproved;
    if (req.body.rating !== undefined) seller.rating = req.body.rating;
    if (req.body.businessName) seller.businessName = req.body.businessName;

    const updatedSeller = await seller.save();
    res.json({
      _id: updatedSeller._id,
      businessName: updatedSeller.businessName,
      email: updatedSeller.email,
      isApproved: updatedSeller.isApproved,
      rating: updatedSeller.rating,
    });
  } catch (error) {
    logControllerError('updateSeller', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a seller
const deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    await Book.deleteMany({ sellerId: seller._id });
    await seller.deleteOne();
    res.json({ message: 'Seller and their books deleted successfully' });
  } catch (error) {
    logControllerError('deleteSeller', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({})
      .populate('sellerId', 'businessName email')
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    logControllerError('getAllBooks', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await Seller.findByIdAndUpdate(book.sellerId, {
      $pull: { listedBooks: book._id },
    });
    await book.deleteOne();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    logControllerError('deleteBook', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    logControllerError('getAllOrders', error);
    res.status(500).json({ message: error.message });
  }
};

// Update order status
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.body.status) order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    logControllerError('updateOrder', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
