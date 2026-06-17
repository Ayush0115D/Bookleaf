import { useState, useEffect } from 'react';
import api from '../../services/api';
import socket from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors = {
  Open: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Closed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const priorityColors = {
  Critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Low: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

function MessageIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M9 13a3 3 0 0 0 6 0" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/tickets')
      .then((res) => setTickets(res.data.tickets))
      .catch(console.error)
      .finally(() => setLoading(false));

    socket.connect();
    socket.emit('join:author', user?._id);

    socket.on('ticket:created', (ticket) => {
      setTickets((prev) => [ticket, ...prev]);
    });

    socket.on('ticket:updated', (ticket) => {
      setTickets((prev) => prev.map((t) => (t._id === ticket._id ? ticket : t)));
      setSelectedTicket((prev) => (prev?._id === ticket._id ? ticket : prev));
    });

    return () => {
      socket.emit('leave:author', user?._id);
      socket.off('ticket:created');
      socket.off('ticket:updated');
    };
  }, [user?._id]);

  const openTicket = async (id) => {
    try {
      const res = await api.get(`/tickets/${id}`);
      setSelectedTicket(res.data.ticket);
      setReplyText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const res = await api.post(`/tickets/${selectedTicket._id}/reply`, { text: replyText });
      setSelectedTicket(res.data.ticket);
      setTickets((prev) => prev.map((t) => (t._id === res.data.ticket._id ? res.data.ticket : t)));
      setReplyText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">My Tickets</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your support queries and responses from the team</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <TicketIcon />
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">No support tickets yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Submit a ticket if you have any questions or issues.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3 max-h-[75vh] overflow-y-auto pr-2">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => openTicket(ticket._id)}
                className={`bg-white dark:bg-gray-800 p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all duration-200 ${
                  selectedTicket?._id === ticket._id
                    ? 'border-gold-400 ring-2 ring-gold-100 dark:ring-gold-900/50 shadow-sm'
                    : 'border-gray-100 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{ticket.subject}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {ticket.category}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {ticket.bookId && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">{ticket.bookId.title}</span>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <MessageIcon />
                    {ticket.messages.length}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[selectedTicket.status]}`}>
                      {selectedTicket.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${priorityColors[selectedTicket.priority]}`}>
                      {selectedTicket.priority}
                    </span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg">{selectedTicket.category}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedTicket.subject}</h2>
                  {selectedTicket.bookId && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Book: {selectedTicket.bookId.title}</p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Created {new Date(selectedTicket.createdAt).toLocaleString()}
                  </p>
                  {selectedTicket.attachments?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attachments</p>
                      {selectedTicket.attachments.map((att, i) => (
                        <a key={i} href={att.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-navy-700 rounded-lg hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-colors group"
                        >
                          <FileIcon />
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gold-600 dark:group-hover:text-gold-400 truncate">{att.filename}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4 max-h-[45vh] overflow-y-auto">
                  {selectedTicket.messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'author' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.sender === 'author'
                          ? 'bg-gold-600 text-white rounded-br-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
                      }`}>
                        <p className={`text-xs font-medium mb-1.5 ${msg.sender === 'author' ? 'text-gold-200' : 'text-gray-500 dark:text-gray-400'}`}>
                          {msg.sender === 'author' ? 'You' : 'BookLeaf Support'}
                        </p>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        <p className={`text-xs mt-1.5 ${msg.sender === 'author' ? 'text-gold-300' : 'text-gray-400 dark:text-gray-500'}`}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {(selectedTicket.status !== 'Resolved' && selectedTicket.status !== 'Closed') && (
                  <form onSubmit={handleReply} className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-shadow duration-200"
                      />
                      <button
                        type="submit"
                        disabled={sending || !replyText.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-600 text-white rounded-xl font-medium text-sm hover:bg-gold-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {sending ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <SendIcon />
                        )}
                        Send
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center h-full flex items-center justify-center">
                <div>
                  <MessageIcon />
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Select a ticket to view the conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
