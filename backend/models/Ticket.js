const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['author', 'admin'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const internalNoteSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ticketSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: null,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 5000,
  },
  category: {
    type: String,
    enum: [
      'Royalty & Payments',
      'ISBN & Metadata Issues',
      'Printing & Quality',
      'Distribution & Availability',
      'Book Status & Production Updates',
      'General Inquiry',
    ],
    default: 'General Inquiry',
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
  },
  messages: [messageSchema],
  internalNotes: [internalNoteSchema],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  aiClassified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

ticketSchema.index({ authorId: 1, createdAt: -1 });
ticketSchema.index({ status: 1, priority: 1, createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);
