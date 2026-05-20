import { useState, useEffect } from 'react';
import api from '../../services/api';
import socket from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors = {
  Open: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  Critical: 'bg-red-100 text-red-800',
  High: 'bg-orange-100 text-orange-800',
  Medium: 'bg-blue-100 text-blue-800',
  Low: 'bg-gray-100 text-gray-800',
};

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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>

      {tickets.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          <p className="text-lg mb-2">No support tickets yet.</p>
          <p>Submit a ticket if you have any questions or issues.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => openTicket(ticket._id)}
                className={`bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition ${
                  selectedTicket?._id === ticket._id ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
                <h3 className="font-medium text-sm truncate">{ticket.subject}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(ticket.createdAt).toLocaleDateString()} — {ticket.category}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {ticket.bookId && (
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{ticket.bookId.title}</span>
                  )}
                  <span className="text-xs text-gray-400">{ticket.messages.length} message(s)</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[selectedTicket.status]}`}>
                      {selectedTicket.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[selectedTicket.priority]}`}>
                      {selectedTicket.priority}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{selectedTicket.category}</span>
                  </div>
                  <h2 className="text-xl font-bold">{selectedTicket.subject}</h2>
                  {selectedTicket.bookId && (
                    <p className="text-sm text-gray-500 mt-1">Book: {selectedTicket.bookId.title}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {selectedTicket.messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'author' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === 'author'
                          ? 'bg-indigo-100 text-indigo-900'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-xs font-medium mb-1">
                          {msg.sender === 'author' ? 'You' : 'BookLeaf Support'}
                        </p>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                <p className="text-lg">Select a ticket to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
