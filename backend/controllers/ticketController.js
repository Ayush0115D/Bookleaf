const Ticket = require('../models/Ticket');
const { uploadFile } = require('../services/cloudinary');
const { autoCloseResolvedTickets } = require('../services/autoClose');
const { validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const User = require('../models/User');

const SLA_HOURS = {
  Critical: 4,
  High: 24,
  Medium: 48,
  Low: 72,
};

const setSlaDue = (ticket) => {
  const hours = SLA_HOURS[ticket.priority] || 48;
  ticket.slaDueAt = new Date(Date.now() + hours * 60 * 60 * 1000);
};

const createNotification = async (io, { userId, type, title, message, link, ticketId }) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      ticketId,
    });
    if (io && userId) {
      io.to(`author:${userId}`).to('admin:room').emit('notification:new', notification);
      io.to(`user:${userId}`).emit('notification:new', notification);
    }
    return notification;
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

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

    // Notify admins of author reply
    try {
      await createNotification(io, {
        userId: ticket.assignedTo || null,
        type: 'ticket_replied',
        title: 'New reply from author',
        message: `Reply on ticket: ${ticket.subject}`,
        link: `/admin/tickets/${ticket._id}`,
        ticketId: ticket._id,
      });
      // Also notify admins in general via admin room? We'll emit generic notification to admin room by broadcasting
      io.to('admin:room').emit('notification:new', {
        type: 'ticket_replied',
        title: 'New reply from author',
        message: `Reply on ticket: ${ticket.subject}`,
        link: `/admin/tickets/${ticket._id}`,
        ticketId: ticket._id,
        createdAt: new Date(),
      });
    } catch (e) {
      console.error('notify failed', e.message);
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

    // Set SLA based on priority (default Medium)
    setSlaDue(ticket);

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
      // Notify all admins
      try {
        const admins = await User.find({ role: 'admin' }).select('_id');
        const notificationData = {
          type: 'ticket_created',
          title: 'New ticket received',
          message: `${req.user.name || 'Author'} created: ${ticket.subject}`,
          link: `/admin/tickets/${ticket._id}`,
          ticketId: ticket._id,
        };
        for (const admin of admins) {
          await createNotification(io, { userId: admin._id, ...notificationData, link: `/admin/tickets/${ticket._id}` });
          io.to(`user:${admin._id}`).emit('notification:new', {
            ...notificationData,
            createdAt: new Date(),
          });
        }
        io.to('admin:room').emit('notification:new', {
          ...notificationData,
          createdAt: new Date(),
        });
      } catch (e) {
        console.error('Failed to notify admins:', e.message);
      }
    }

    res.status(201).json({ ticket: populatedTicket });
  } catch (error) {
    next(error);
  }
};

exports.getMyTickets = async (req, res, next) => {
  try {
    await autoCloseResolvedTickets();
    // Backfill SLA for existing tickets
    try {
      const ticketsWithoutSla = await Ticket.find({ authorId: req.user._id, slaDueAt: null });
      const SLA_HOURS_BACKFILL = { Critical: 4, High: 24, Medium: 48, Low: 72 };
      for (const t of ticketsWithoutSla) {
        const hours = SLA_HOURS_BACKFILL[t.priority] || 48;
        t.slaDueAt = new Date(t.createdAt.getTime() + hours * 60 * 60 * 1000);
        await t.save();
      }
    } catch (e) {
      console.error('SLA backfill failed:', e.message);
    }
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
