const Book = require('../models/Book');

exports.getMyBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ authorId: req.user._id }).sort({ createdAt: -1 });

    const summary = {
      totalBooks: books.length,
      totalRoyaltyEarned: books.reduce((sum, b) => sum + b.royaltyEarned, 0),
      totalRoyaltyPaid: books.reduce((sum, b) => sum + b.royaltyPaid, 0),
      totalRoyaltyPending: books.reduce((sum, b) => sum + b.royaltyPending, 0),
      totalCopiesSold: books.reduce((sum, b) => sum + b.copiesSold, 0),
    };

    res.json({ books, summary });
  } catch (error) {
    next(error);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const { title, isbn, genre, publishDate, mrp, status } = req.body;

    const book = await Book.create({
      title,
      isbn,
      genre,
      mrp,
      status: status || 'Manuscript Received',
      publishDate: publishDate || undefined,
      authorId: req.user._id,
    });

    res.status(201).json({ book });
  } catch (error) {
    next(error);
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().populate('authorId', 'name email').sort({ createdAt: -1 });
    res.json({ books });
  } catch (error) {
    next(error);
  }
};
