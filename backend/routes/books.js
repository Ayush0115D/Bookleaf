const express = require('express');
const { getMyBooks, getAllBooks } = require('../controllers/bookController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getMyBooks);
router.get('/all', auth, adminOnly, getAllBooks);

module.exports = router;
