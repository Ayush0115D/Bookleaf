const express = require('express');
const { getMyBooks, createBook, getAllBooks } = require('../controllers/bookController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getMyBooks);
router.post('/', auth, createBook);
router.get('/all', auth, adminOnly, getAllBooks);

module.exports = router;
