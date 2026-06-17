const Ticket = require('../models/Ticket');

async function autoCloseResolvedTickets() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const tickets = await Ticket.find({
    status: 'Resolved',
    resolvedAt: { $lte: sevenDaysAgo },
  });

  for (const ticket of tickets) {
    ticket.status = 'Closed';
    ticket.messages.push({
      sender: 'admin',
      text: 'Ticket automatically closed (no author response within 7 days of resolution).',
    });
    await ticket.save();
  }

  if (tickets.length > 0) {
    console.log(`Auto-closed ${tickets.length} resolved ticket(s)`);
  }

  return tickets;
}

module.exports = { autoCloseResolvedTickets };
