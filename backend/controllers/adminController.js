const Ticket = require('../models/Ticket');
const { generateDraftResponse, classifyTicket } = require('../services/aiService');

exports.getAdminTickets = async (req, res, next) => {
  try {
    const { status, category, priority, authorId, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (authorId) filter.authorId = authorId;
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(filter)
      .populate('authorId', 'name email')
      .populate('bookId', 'title isbn')
      .populate('assignedTo', 'name email')
      .sort({ priority: -1, createdAt: 1 });

    const stats = {
      open: await Ticket.countDocuments({ status: 'Open' }),
      inProgress: await Ticket.countDocuments({ status: 'In Progress' }),
      resolved: await Ticket.countDocuments({ status: 'Resolved' }),
      closed: await Ticket.countDocuments({ status: 'Closed' }),
      total: await Ticket.countDocuments(),
    };

    res.json({ tickets, stats });
  } catch (error) {
    next(error);
  }
};

exports.getAdminTicketDetail = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('authorId', 'name email bankDetails')
      .populate('bookId', 'title isbn genre mrp status')
      .populate('assignedTo', 'name email')
      .populate('internalNotes.adminId', 'name email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const { status, category, priority, assignedTo, internalNote } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (category) {
      ticket.category = category;
      ticket.aiClassified = false;
    }
    if (priority) ticket.priority = priority;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (internalNote) {
      ticket.internalNotes.push({
        adminId: req.user._id,
        text: internalNote,
      });
    }

    await ticket.save();

    const populated = await Ticket.findById(ticket._id)
      .populate('authorId', 'name email')
      .populate('bookId', 'title isbn')
      .populate('assignedTo', 'name email');

    const io = req.app.get('io');
    if (io) {
      io.to(`author:${ticket.authorId}`).emit('ticket:updated', populated);
    }

    res.json({ ticket: populated });
  } catch (error) {
    next(error);
  }
};

exports.respondToTicket = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Response text is required' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.messages.push({
      sender: 'admin',
      text: text.trim(),
    });

    if (ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    await ticket.save();

    const populated = await Ticket.findById(ticket._id)
      .populate('authorId', 'name email')
      .populate('bookId', 'title isbn')
      .populate('assignedTo', 'name email');

    const io = req.app.get('io');
    if (io) {
      io.to(`author:${ticket.authorId}`).emit('ticket:updated', populated);
    }

    res.json({ ticket: populated });
  } catch (error) {
    next(error);
  }
};

exports.generateDraft = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('authorId', 'name email')
      .populate('bookId', 'title isbn');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const draft = await generateDraftResponse({
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      authorName: ticket.authorId?.name,
      bookTitle: ticket.bookId?.title,
    });

    res.json({ draft });
  } catch (error) {
    next(error);
  }
};

exports.reclassifyTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const aiResult = await classifyTicket(ticket.subject, ticket.description);
    ticket.category = aiResult.category;
    ticket.priority = aiResult.priority;
    ticket.aiClassified = true;
    await ticket.save();

    res.json({ ticket, aiResult });
  } catch (error) {
    next(error);
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    next(error);
  }
};
