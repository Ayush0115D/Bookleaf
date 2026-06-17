const Ticket = require('../models/Ticket');
const { uploadFile } = require('../services/cloudinary');
const { validationResult } = require('express-validator');

exports.replyToTicket = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Reply text is required' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
      return res.status(400).json({ error: 'Cannot reply to a resolved or closed ticket' });
    }

    ticket.messages.push({
      sender: 'author',
      text: text.trim(),
    });

    if (ticket.status !== 'Open') {
      ticket.status = 'Open';
    }

    await ticket.save();

    const populated = await Ticket.findById(ticket._id)
      .populate('authorId', 'name email')
      .populate('bookId', 'title isbn');

    const io = req.app.get('io');
    if (io) {
      io.to('admin:room').emit('ticket:updated', populated);
    }

    res.json({ ticket: populated });
  } catch (error) {
    next(error);
  }
};

exports.createTicket = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { bookId, subject, description } = req.body;

    const ticket = new Ticket({
      authorId: req.user._id,
      bookId: bookId || null,
      subject,
      description,
      messages: [{ sender: 'author', text: description }],
    });

    if (req.file) {
      try {
        const uploaded = await uploadFile(req.file.buffer, req.file.originalname);
        ticket.attachments.push(uploaded);
      } catch (uploadError) {
        console.error('File upload failed:', uploadError.message);
      }
    }

    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('authorId', 'name email')
      .populate('bookId', 'title isbn');

    const io = req.app.get('io');
    if (io) {
      io.to(`author:${req.user._id}`).emit('ticket:created', populatedTicket);
      io.to('admin:room').emit('ticket:new', populatedTicket);
    }

    res.status(201).json({ ticket: populatedTicket });
  } catch (error) {
    next(error);
  }
};

exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ authorId: req.user._id })
      .populate('bookId', 'title isbn')
      .sort({ updatedAt: -1 });

    res.json({ tickets });
  } catch (error) {
    next(error);
  }
};

exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('authorId', 'name email')
      .populate('bookId', 'title isbn')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (req.user.role === 'author' && ticket.authorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const response = ticket.toObject();
    if (req.user.role === 'author') {
      delete response.internalNotes;
    }

    res.json({ ticket: response });
  } catch (error) {
    next(error);
  }
};
