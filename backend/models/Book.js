const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
  },
  publishDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: [
      'Manuscript Received',
      'Editing',
      'Cover Design',
      'Typesetting',
      'Proofreading',
      'ISBN Assignment',
      'Printing',
      'Distribution Setup',
      'Published & Live',
    ],
    required: [true, 'Status is required'],
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: 0,
  },
  copiesSold: {
    type: Number,
    default: 0,
  },
  royaltyEarned: {
    type: Number,
    default: 0,
  },
  royaltyPaid: {
    type: Number,
    default: 0,
  },
  royaltyPending: {
    type: Number,
    default: 0,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
