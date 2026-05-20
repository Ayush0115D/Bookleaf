const express = require('express');
const { body } = require('express-validator');
const {
  getAdminTickets,
  getAdminTicketDetail,
  updateTicket,
  respondToTicket,
  generateDraft,
  reclassifyTicket,
  deleteTicket,
} = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/tickets', auth, adminOnly, getAdminTickets);
router.get('/tickets/:id', auth, adminOnly, getAdminTicketDetail);
router.patch('/tickets/:id', auth, adminOnly, updateTicket);
router.post(
  '/tickets/:id/respond',
  auth,
  adminOnly,
  [body('text').trim().notEmpty().withMessage('Response text is required')],
  respondToTicket
);
router.post('/tickets/:id/draft', auth, adminOnly, generateDraft);
router.post('/tickets/:id/reclassify', auth, adminOnly, reclassifyTicket);
router.delete('/tickets/:id', auth, adminOnly, deleteTicket);

module.exports = router;
