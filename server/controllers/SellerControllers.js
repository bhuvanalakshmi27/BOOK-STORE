const Seller = require('../models/Seller/sellerModel');
const Book = require('../models/Seller/bookModel');
const Order = require('../models/Users/orderModel');
const fs = require('fs');
const path = require('path');
const { generateToken } = require('../middlewares/authMiddleware');

const errorLogFile = path.join(__dirname, '..', 'logs', 'server-errors.log');

const logControllerError = (scope, error) => {
  const errorText = error && error.stack ? error.stack : String(error);
  const entry = `[${new Date().toISOString()}] [SellerControllers:${scope}] ${errorText}\n\n`;

  try {
    fs.mkdirSync(path.dirname(errorLogFile), { recursive: true });
    fs.appendFileSync(errorLogFile, entry, 'utf8');
  } catch (logError) {
    console.error('Failed to write seller controller error log:', logError);
  }
};

// Register a new seller
const registerSeller = async (req, res) => {
  try {
    const { businessName, email, password, profileInfo } = req.body;

    if (!businessName || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide business name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const sellerExists = await Seller.findOne({ email });
    if (sellerExists) {
      return res.status(400).json({ message: 'Seller already exists with this email' });
    }

    const seller = await Seller.create({
      businessName,
      email,
      password,
      profileInfo,
    });

    res.status(201).json({
      _id: seller._id,
      businessName: seller.businessName,
      email: seller.email,
      role: seller.role,
      isApproved: seller.isApproved,
      token: generateToken(seller._id, 'seller'),
    });
  } catch (error) {
    logControllerError('registerSeller', error);
    res.status(500).json({ message: error.message });
  }
};

// Login a seller
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const seller = await Seller.findOne({ email });
    if (seller && (await seller.matchPassword(password))) {
      res.json({
        _id: seller._id,
        businessName: seller.businessName,
        email: seller.email,
        role: seller.role,
        isApproved: seller.isApproved,
        token: generateToken(seller._id, 'seller'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    logControllerError('loginSeller', error);
    res.status(500).json({ message: error.message });
  }
};

// Get seller profile
const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user._id).select('-password');
    res.json(seller);
  } catch (error) {
    logControllerError('getSellerProfile', error);
    res.status(500).json({ message: error.message });
  }
};

// Update seller profile
const updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user._id);

    if (seller) {
      seller.businessName = req.body.businessName || seller.businessName;
      seller.email = req.body.email || seller.email;
      if (req.body.profileInfo) {
        seller.profileInfo = { ...seller.profileInfo.toObject(), ...req.body.profileInfo };
      }
      if (req.body.password) {
        if (req.body.password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        seller.password = req.body.password;
      }

      const updatedSeller = await seller.save();

      res.json({
        _id: updatedSeller._id,
        businessName: updatedSeller.businessName,
        email: updatedSeller.email,
        role: updatedSeller.role,
        isApproved: updatedSeller.isApproved,
        profileInfo: updatedSeller.profileInfo,
        token: generateToken(updatedSeller._id, 'seller'),
      });
    } else {
      res.status(404).json({ message: 'Seller not found' });
    }
  } catch (error) {
    logControllerError('updateSellerProfile', error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new book listing
const addBook = async (req, res) => {
  try {
    if (!req.user.isApproved) {
      return res
        .status(403)
        .json({ message: 'Your seller account is pending admin approval' });
    }

    const { title, authors, genres, description, price, stock, inventory } = req.body;

    if (!title || !description || price === undefined || stock === undefined) {
      return res.status(400).json({
        message: 'Please provide title, description, price, and stock',
      });
    }

    const parsedAuthors = typeof authors === 'string' ? JSON.parse(authors) : authors;
    const parsedGenres = typeof genres === 'string' ? JSON.parse(genres) : genres;

    const bookData = {
      title,
      authors: parsedAuthors || [],
      genres: parsedGenres || [],
      description,
      price: Number(price),
      stock: Number(stock),
      sellerId: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      inventory: inventory
        ? typeof inventory === 'string'
          ? JSON.parse(inventory)
          : inventory
        : { quantity: Number(stock), location: 'warehouse', condition: 'new' },
    };

    const book = await Book.create(bookData);

    await Seller.findByIdAndUpdate(req.user._id, {
      $push: { listedBooks: book._id },
    });

    res.status(201).json(book);
  } catch (error) {
    logControllerError('addBook', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a book listing
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    const { title, authors, genres, description, price, stock, inventory } = req.body;

    book.title = title || book.title;
    if (authors) {
      book.authors = typeof authors === 'string' ? JSON.parse(authors) : authors;
    }
    if (genres) {
      book.genres = typeof genres === 'string' ? JSON.parse(genres) : genres;
    }
    book.description = description || book.description;
    if (price !== undefined) book.price = Number(price);
    if (stock !== undefined) {
      book.stock = Number(stock);
      book.inventory.quantity = Number(stock);
    }
    if (inventory) {
      book.inventory = typeof inventory === 'string' ? JSON.parse(inventory) : inventory;
    }
    if (req.file) {
      book.image = `/uploads/${req.file.filename}`;
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    logControllerError('updateBook', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a book listing
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await book.deleteOne();
    await Seller.findByIdAndUpdate(req.user._id, {
      $pull: { listedBooks: book._id },
    });

    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    logControllerError('deleteBook', error);
    res.status(500).json({ message: error.message });
  }
};

// Get seller books
const getSellerBooks = async (req, res) => {
  try {
    const books = await Book.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    logControllerError('getSellerBooks', error);
    res.status(500).json({ message: error.message });
  }
};

// Get seller orders
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      'items.sellerId': req.user._id,
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const sellerOrders = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.filter(
        (item) => item.sellerId.toString() === req.user._id.toString()
      ),
    }));

    res.json(sellerOrders);
  } catch (error) {
    logControllerError('getSellerOrders', error);
    res.status(500).json({ message: error.message });
  }
};

// Update order status for seller items
const fulfillOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Please provide a valid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const hasSellerItems = order.items.some(
      (item) => item.sellerId.toString() === req.user._id.toString()
    );

    if (!hasSellerItems) {
      return res.status(403).json({ message: 'No items from your store in this order' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    logControllerError('fulfillOrder', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
