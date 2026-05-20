const Ticket = require('../models/Ticket');
const { classifyTicket } = require('../services/aiService');
const { validationResult } = require('express-validator');

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

    let aiResult = { category: 'General Inquiry', priority: 'Medium', reasoning: 'Classification pending' };
    try {
      aiResult = await classifyTicket(subject, description);
      ticket.category = aiResult.category;
      ticket.priority = aiResult.priority;
      ticket.aiClassified = true;
    } catch (aiError) {
      console.error('AI classification failed during ticket creation:', aiError.message);
      ticket.category = 'General Inquiry';
      ticket.priority = 'Medium';
      ticket.aiClassified = false;
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

    res.status(201).json({ ticket: populatedTicket, aiResult });
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
