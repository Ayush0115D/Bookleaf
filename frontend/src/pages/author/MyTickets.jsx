import { useState, useEffect } from 'react';
import api from '../../services/api';
import socket from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors = {
  Open: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Closed: 'bg-gray-50 text-gray-700 border-gray-200',
};

const priorityColors = {
  Critical: 'bg-red-50 text-red-700 border-red-200',
  High: 'bg-orange-50 text-orange-700 border-orange-200',
  Medium: 'bg-blue-50 text-blue-700 border-blue-200',
  Low: 'bg-gray-50 text-gray-700 border-gray-200',
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
    <svg className="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M9 13a3 3 0 0 0 6 0" />
    </svg>
  );
}

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
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
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Tickets</h1>
        <p className="text-gray-500 mt-1">Track your support queries and responses from the team</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <TicketIcon />
          </div>
          <p className="text-lg font-medium text-gray-700 mb-1">No support tickets yet</p>
          <p className="text-sm text-gray-500">Submit a ticket if you have any questions or issues.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3 max-h-[75vh] overflow-y-auto pr-2">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => openTicket(ticket._id)}
                className={`bg-white p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all duration-200 ${
                  selectedTicket?._id === ticket._id
                    ? 'border-indigo-400 ring-2 ring-indigo-100 shadow-sm'
                    : 'border-gray-100'
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
                <h3 className="font-medium text-sm text-gray-900 truncate">{ticket.subject}</h3>
                <p className="text-xs text-gray-400 mt-1.5">
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {ticket.category}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {ticket.bookId && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{ticket.bookId.title}</span>
                  )}
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <MessageIcon />
                    {ticket.messages.length}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[selectedTicket.status]}`}>
                      {selectedTicket.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${priorityColors[selectedTicket.priority]}`}>
                      {selectedTicket.priority}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{selectedTicket.category}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedTicket.subject}</h2>
                  {selectedTicket.bookId && (
                    <p className="text-sm text-gray-500 mt-1">Book: {selectedTicket.bookId.title}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Created {new Date(selectedTicket.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="p-6 space-y-4 max-h-[55vh] overflow-y-auto">
                  {selectedTicket.messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'author' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.sender === 'author'
                          ? 'bg-indigo-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}>
                        <p className={`text-xs font-medium mb-1.5 ${msg.sender === 'author' ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {msg.sender === 'author' ? 'You' : 'BookLeaf Support'}
                        </p>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        <p className={`text-xs mt-1.5 ${msg.sender === 'author' ? 'text-indigo-300' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center h-full flex items-center justify-center">
                <div>
                  <MessageIcon />
                  <p className="text-gray-500 text-sm mt-2">Select a ticket to view the conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
