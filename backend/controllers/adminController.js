const Ticket = require('../models/Ticket');
const { generateDraftResponse, classifyTicket } = require('../services/aiService');
const { autoCloseResolvedTickets } = require('../services/autoClose');
const Notification = require('../models/Notification');

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
    if (!userId) return;
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      ticketId,
    });
    if (io) {
      io.to(`author:${userId}`).emit('notification:new', notification);
      io.to(`user:${userId}`).emit('notification:new', notification);
    }
    return notification;
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

exports.getAdminTickets = async (req, res, next) => {
  try {
    await autoCloseResolvedTickets();

    // Backfill SLA for existing tickets
    try {
      const ticketsWithoutSla = await Ticket.find({ slaDueAt: null });
      const SLA_HOURS_BACKFILL = { Critical: 4, High: 24, Medium: 48, Low: 72 };
      for (const t of ticketsWithoutSla) {
        const hours = SLA_HOURS_BACKFILL[t.priority] || 48;
        t.slaDueAt = new Date(t.createdAt.getTime() + hours * 60 * 60 * 1000);
        await t.save();
      }
    } catch (e) {
      console.error('SLA backfill failed:', e.message);
    }

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
    let ticket = await Ticket.findById(req.params.id)
      .populate('authorId', 'name email bankDetails')
      .populate('bookId', 'title isbn genre mrp status')
      .populate('assignedTo', 'name email')
      .populate('internalNotes.adminId', 'name email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (!ticket.slaDueAt) {
      const SLA_HOURS_BACKFILL = { Critical: 4, High: 24, Medium: 48, Low: 72 };
      const hours = SLA_HOURS_BACKFILL[ticket.priority] || 48;
      ticket.slaDueAt = new Date(ticket.createdAt.getTime() + hours * 60 * 60 * 1000);
      await ticket.save();
      ticket = await Ticket.findById(req.params.id)
        .populate('authorId', 'name email bankDetails')
        .populate('bookId', 'title isbn genre mrp status')
        .populate('assignedTo', 'name email')
        .populate('internalNotes.adminId', 'name email');
    }

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const { status, category, priority, assignedTo, internalNote, escalated } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const oldStatus = ticket.status;
    const oldPriority = ticket.priority;
    const oldAssigned = ticket.assignedTo?.toString();

    if (status) {
      ticket.status = status;
      if (status === 'Resolved') {
        ticket.resolvedAt = new Date();
      }
    }
    if (category) {
      ticket.category = category;
      ticket.aiClassified = false;
    }
    if (priority && priority !== oldPriority) {
      ticket.priority = priority;
      setSlaDue(ticket);
      ticket.slaBreached = false;
    } else if (priority) {
      ticket.priority = priority;
      setSlaDue(ticket);
      ticket.slaBreached = false;
    }
    if (assignedTo !== undefined) {
      ticket.assignedTo = assignedTo || null;
    }
    if (escalated !== undefined) {
      ticket.escalated = escalated;
      if (escalated && !ticket.escalatedAt) {
        ticket.escalatedAt = new Date();
      } else if (!escalated) {
        ticket.escalatedAt = null;
      }
    }
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
    const authorIdUpd = ticket.authorId?._id || ticket.authorId;
    if (io) {
      io.to(`author:${authorIdUpd}`).emit('ticket:updated', populated);
      io.to('admin:room').emit('ticket:updated', populated);
      if (status && status !== oldStatus) {
        io.to(`author:${authorIdUpd}`).emit('notification:new', {
          type: 'ticket_status_changed',
          title: 'Ticket status updated',
          message: `${ticket.subject} is now ${status}`,
          link: '/author/tickets',
          ticketId: ticket._id,
          createdAt: new Date(),
        });
        io.to(`user:${authorIdUpd}`).emit('notification:new', {
          type: 'ticket_status_changed',
          title: 'Ticket status updated',
          message: `${ticket.subject} is now ${status}`,
          link: '/author/tickets',
          ticketId: ticket._id,
          createdAt: new Date(),
        });
      }
    }

    // Create notifications
    try {
      if (status && status !== oldStatus) {
        await createNotification(io, {
          userId: authorIdUpd,
          type: 'ticket_status_changed',
          title: 'Ticket status updated',
          message: `Your ticket "${ticket.subject}" is now ${status}`,
          link: '/author/tickets',
          ticketId: ticket._id,
        });
        if (io) {
          io.to(`user:${authorIdUpd}`).emit('notification:new', {
            type: 'ticket_status_changed',
            title: 'Ticket status updated',
            message: `Your ticket "${ticket.subject}" is now ${status}`,
            link: '/author/tickets',
            ticketId: ticket._id,
            createdAt: new Date(),
          });
        }
      }
      if (assignedTo && assignedTo !== oldAssigned) {
        await createNotification(io, {
          userId: authorIdUpd,
          type: 'ticket_assigned',
          title: 'Ticket update',
          message: `Your ticket "${ticket.subject}" has been assigned for review`,
          link: '/author/tickets',
          ticketId: ticket._id,
        });
        if (io) {
          io.to(`user:${authorIdUpd}`).emit('notification:new', {
            type: 'ticket_assigned',
            title: 'Ticket update',
            message: `Your ticket "${ticket.subject}" has been assigned for review`,
            link: '/author/tickets',
            ticketId: ticket._id,
            createdAt: new Date(),
          });
        }
        // notify assigned admin
        await createNotification(io, {
          userId: assignedTo,
          type: 'ticket_assigned',
          title: 'Ticket assigned to you',
          message: `Ticket assigned: ${ticket.subject}`,
          link: `/admin/tickets/${ticket._id}`,
          ticketId: ticket._id,
        });
        if (io) {
          io.to(`user:${assignedTo}`).emit('notification:new', {
            type: 'ticket_assigned',
            title: 'Ticket assigned to you',
            message: `Ticket assigned: ${ticket.subject}`,
            link: `/admin/tickets/${ticket._id}`,
            ticketId: ticket._id,
            createdAt: new Date(),
          });
        }
      }
      if (escalated !== undefined) {
        const admins = await require('../models/User').find({ role: 'admin' }).select('_id');
        for (const admin of admins) {
          if (io) {
            io.to(`user:${admin._id}`).emit('notification:new', {
              type: 'ticket_updated',
              title: escalated ? 'Ticket escalated' : 'Ticket unescalated',
              message: `${ticket.subject} has been ${escalated ? 'escalated' : 'unescalated'}`,
              link: `/admin/tickets/${ticket._id}`,
              ticketId: ticket._id,
              createdAt: new Date(),
            });
          }
          await createNotification(io, {
            userId: admin._id,
            type: 'ticket_updated',
            title: escalated ? 'Ticket escalated' : 'Ticket unescalated',
            message: `${ticket.subject} has been ${escalated ? 'escalated' : 'unescalated'}`,
            link: `/admin/tickets/${ticket._id}`,
            ticketId: ticket._id,
          });
        }
      }
    } catch (e) {
      console.error('notify failed', e.message);
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

    const ticket = await Ticket.findById(req.params.id).populate('authorId', '_id name email');
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

    if (!ticket.firstResponseAt) {
      ticket.firstResponseAt = new Date();
    }

    await ticket.save();

    const populated = await Ticket.findById(ticket._id)
      .populate('authorId', 'name email')
      .populate('bookId', 'title isbn')
      .populate('assignedTo', 'name email');

    const io = req.app.get('io');
    const authorId = ticket.authorId?._id || ticket.authorId;
    if (io) {
      io.to(`author:${authorId}`).emit('ticket:updated', populated);
      io.to(`author:${authorId}`).emit('notification:new', {
        type: 'ticket_replied',
        title: 'Admin replied',
        message: `Admin replied to "${ticket.subject}"`,
        link: '/author/tickets',
        ticketId: ticket._id,
        createdAt: new Date(),
      });
      io.to(`user:${authorId}`).emit('notification:new', {
        type: 'ticket_replied',
        title: 'Admin replied',
        message: `Admin replied to "${ticket.subject}"`,
        link: '/author/tickets',
        ticketId: ticket._id,
        createdAt: new Date(),
      });
    }

    try {
      await createNotification(io, {
        userId: authorId,
        type: 'ticket_replied',
        title: 'Admin replied',
        message: `You received a reply on "${ticket.subject}"`,
        link: '/author/tickets',
        ticketId: ticket._id,
      });
    } catch (e) {
      console.error('notify failed', e.message);
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

    const recentMessages = ticket.messages.slice(-4).map((m) => ({
      sender: m.sender,
      text: m.text.substring(0, 500),
    }));

    const draft = await generateDraftResponse({
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      authorName: ticket.authorId?.name,
      bookTitle: ticket.bookId?.title,
      bookStatus: ticket.bookId?.status,
      recentMessages,
    });

    res.json({ draft });
  } catch (error) {
    next(error);
  }
};

exports.reclassifyTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('messages');
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const conversation = (ticket.messages || [])
      .slice(-6)
      .map((m) => `${m.sender}: ${m.text}`)
      .join('\n');

    const aiResult = await classifyTicket(
      ticket.subject,
      conversation || ticket.description
    );

    res.json({ aiResult });
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
