const express = require('express');
const { body } = require('express-validator');
const { login, getMe, getAuthors } = require('../controllers/authController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/me', auth, getMe);
router.get('/authors', auth, adminOnly, getAuthors);

module.exports = router;
