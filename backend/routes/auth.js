const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updateProfile, changePassword, updateBankDetails, getAuthors, getAdmins } = require('../controllers/authController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/me', auth, getMe);
router.put(
  '/profile',
  auth,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  updateProfile
);
router.post(
  '/change-password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  changePassword
);
router.put(
  '/bank-details',
  auth,
  [
    body('accountHolder').trim().notEmpty().withMessage('Account holder name is required'),
    body('accountNumber').trim().notEmpty().withMessage('Account number is required'),
    body('ifscCode').trim().notEmpty().withMessage('IFSC code is required'),
    body('bankName').trim().notEmpty().withMessage('Bank name is required'),
  ],
  updateBankDetails
);
router.get('/authors', auth, adminOnly, getAuthors);
router.get('/admins', auth, adminOnly, getAdmins);

module.exports = router;
