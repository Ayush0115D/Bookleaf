const express = require('express');
const { body } = require('express-validator');
const { createTicket, getMyTickets, getTicketById, replyToTicket } = require('../controllers/ticketController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post(
  '/',
  auth,
  upload.single('attachment'),
  [
    body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 5000 }),
    body('bookId').optional({ values: 'null' }).isMongoId().withMessage('Invalid book ID'),
  ],
  createTicket
);

router.get('/', auth, getMyTickets);
router.get('/:id', auth, getTicketById);
router.post('/:id/reply', auth, [body('text').trim().notEmpty().withMessage('Reply text is required')], replyToTicket);

module.exports = router;
