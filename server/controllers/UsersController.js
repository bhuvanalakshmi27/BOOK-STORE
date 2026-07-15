const User = require('../models/Users/userModel');
const Book = require('../models/Seller/bookModel');
const Order = require('../models/Users/orderModel');
const Review = require('../models/Users/reviewModel');
const fs = require('fs');
const path = require('path');
const { generateToken } = require('../middlewares/authMiddleware');

const errorLogFile = path.join(__dirname, '..', 'logs', 'server-errors.log');

const logControllerError = (scope, error) => {
  const errorText = error && error.stack ? error.stack : String(error);
  const entry = `[${new Date().toISOString()}] [UsersController:${scope}] ${errorText}\n\n`;

  try {
    fs.mkdirSync(path.dirname(errorLogFile), { recursive: true });
    fs.appendFileSync(errorLogFile, entry, 'utf8');
  } catch (logError) {
    console.error('Failed to write controller error log:', logError);
  }
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, 'user'),
    });
  } catch (error) {
    logControllerError('registerUser', error);
    res.status(500).json({ message: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, 'user'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    logControllerError('loginUser', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    logControllerError('getUserProfile', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.preferences) {
        user.preferences = { ...user.preferences.toObject(), ...req.body.preferences };
      }
      if (req.body.password) {
        if (req.body.password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        preferences: updatedUser.preferences,
        token: generateToken(updatedUser._id, 'user'),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    logControllerError('updateUserProfile', error);
    res.status(500).json({ message: error.message });
  }
};

// Get books with search and filters
const getBooks = async (req, res) => {
  try {
    const { search, genre, author, minPrice, maxPrice, minRating } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { authors: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (genre) {
      filter.genres = { $in: genre.split(',').map((g) => g.trim()) };
    }

    if (author) {
      filter.authors = { $in: author.split(',').map((a) => a.trim()) };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      filter.averageRating = { $gte: Number(minRating) };
    }

    filter.stock = { $gt: 0 };

    const books = await Book.find(filter)
      .populate('sellerId', 'businessName isApproved')
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    logControllerError('getBooks', error);
    res.status(500).json({ message: error.message });
  }
};

// Get one book
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      'sellerId',
      'businessName profileInfo isApproved'
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    logControllerError('getBookById', error);
    res.status(500).json({ message: error.message });
  }
};

// Place an order
const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.bookId}` });
      }
      if (book.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${book.title}". Available: ${book.stock}`,
        });
      }

      orderItems.push({
        bookId: book._id,
        title: book.title,
        price: book.price,
        quantity: item.quantity,
        sellerId: book.sellerId,
      });

      totalPrice += book.price * item.quantity;

      book.stock -= item.quantity;
      book.inventory.quantity = book.stock;
      await book.save();
    }

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalPrice,
      shippingAddress,
      status: 'pending',
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { orderHistory: order._id },
    });

    res.status(201).json(order);
  } catch (error) {
    logControllerError('placeOrder', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user order history
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    logControllerError('getUserOrders', error);
    res.status(500).json({ message: error.message });
  }
};

// Get one order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    logControllerError('getOrderById', error);
    res.status(500).json({ message: error.message });
  }
};

// Add a review for a book
const addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    if (!bookId || !rating) {
      return res.status(400).json({ message: 'Book ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingReview = await Review.findOne({
      userId: req.user._id,
      bookId,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = await Review.create({
      userId: req.user._id,
      bookId,
      rating,
      comment,
    });

    const reviews = await Review.find({ bookId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    book.averageRating = Math.round(avgRating * 10) / 10;
    book.reviewCount = reviews.length;
    await book.save();

    res.status(201).json(review);
  } catch (error) {
    logControllerError('addReview', error);
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a book
const getBookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    logControllerError('getBookReviews', error);
    res.status(500).json({ message: error.message });
  }
};

// Get filter values
const getFilters = async (req, res) => {
  try {
    const books = await Book.find({ stock: { $gt: 0 } });
    const genres = [...new Set(books.flatMap((b) => b.genres))].filter(Boolean).sort();
    const authors = [...new Set(books.flatMap((b) => b.authors))].filter(Boolean).sort();
    res.json({ genres, authors });
  } catch (error) {
    logControllerError('getFilters', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
