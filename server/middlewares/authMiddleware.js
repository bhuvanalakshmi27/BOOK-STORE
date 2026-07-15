const jwt = require('jsonwebtoken');
const User = require('../models/Users/userModel');
const Seller = require('../models/Seller/sellerModel');
const Admin = require('../models/Admin/adminModel');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let account;
      if (decoded.role === 'user') {
        account = await User.findById(decoded.id).select('-password');
      } else if (decoded.role === 'seller') {
        account = await Seller.findById(decoded.id).select('-password');
      } else if (decoded.role === 'admin') {
        account = await Admin.findById(decoded.id).select('-password');
      }

      if (!account) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = account;
      req.userRole = decoded.role;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        message: `Role '${req.userRole}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles, generateToken };
