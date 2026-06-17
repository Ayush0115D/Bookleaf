const express = require('express');
const { getMyBooks, createBook, updateBookCover, deleteBookCover, getAllBooks } = require('../controllers/bookController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', auth, getMyBooks);
router.post('/', auth, upload.single('cover'), createBook);
router.put('/:id/cover', auth, upload.single('cover'), updateBookCover);
router.delete('/:id/cover', auth, deleteBookCover);
router.get('/all', auth, adminOnly, getAllBooks);

module.exports = router;
