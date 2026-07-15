const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    authors: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      default: '',
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    inventory: {
      quantity: { type: Number, default: 0 },
      location: { type: String, default: 'warehouse' },
      condition: {
        type: String,
        enum: ['new', 'like-new', 'good', 'fair'],
        default: 'new',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
