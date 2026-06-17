const Book = require('../models/Book');
const { uploadFile } = require('../services/cloudinary');

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
    const { title, isbn, genre, publishDate, mrp, status, copiesSold, royaltyEarned, royaltyPaid, royaltyPending } = req.body;

    let coverImage;
    if (req.file) {
      try {
        const result = await uploadFile(req.file.buffer, req.file.originalname, 'bookleaf/covers');
        coverImage = { url: result.url, publicId: result.publicId };
      } catch (uploadErr) {
        console.error('Cover upload failed:', uploadErr.message);
      }
    }

    const book = await Book.create({
      title,
      isbn,
      genre,
      mrp,
      status: status || 'Manuscript Received',
      publishDate: publishDate || undefined,
      copiesSold: Number(copiesSold) || 0,
      royaltyEarned: Number(royaltyEarned) || 0,
      royaltyPaid: Number(royaltyPaid) || 0,
      royaltyPending: Number(royaltyPending) || 0,
      authorId: req.user._id,
      ...(coverImage && { coverImage }),
    });

    res.status(201).json({ book });
  } catch (error) {
    next(error);
  }
};

exports.updateBookCover = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, authorId: req.user._id });
    if (!book) return res.status(404).json({ error: 'Book not found' });

    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const result = await uploadFile(req.file.buffer, req.file.originalname, 'bookleaf/covers');
    book.coverImage = { url: result.url, publicId: result.publicId };
    await book.save();

    res.json({ book });
  } catch (error) {
    next(error);
  }
};

exports.deleteBookCover = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, authorId: req.user._id });
    if (!book) return res.status(404).json({ error: 'Book not found' });

    book.coverImage = undefined;
    await book.save();

    res.json({ book });
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
