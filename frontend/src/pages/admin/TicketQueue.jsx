import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import socket from '../../services/socket';
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

export default function TicketQueue() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '' });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchTickets = () => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.category) params.set('category', filters.category);
    if (filters.priority) params.set('priority', filters.priority);
    if (search) params.set('search', search);

    api.get(`/admin/tickets?${params}`)
      .then((res) => {
        setTickets(res.data.tickets);
        setStats(res.data.stats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();

    socket.connect();
    socket.emit('join:admin');

    socket.on('ticket:new', () => fetchTickets());
    socket.on('ticket:updated', () => fetchTickets());

    return () => {
      socket.emit('leave:admin');
      socket.off('ticket:new');
      socket.off('ticket:updated');
    };
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ticket Queue</h1>

      {stats && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-xs text-yellow-600 font-medium">Open</p>
            <p className="text-xl font-bold text-yellow-600">{stats.open}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-xs text-blue-600 font-medium">In Progress</p>
            <p className="text-xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-xs text-green-600 font-medium">Resolved</p>
            <p className="text-xl font-bold text-green-600">{stats.resolved}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-xs text-gray-600 font-medium">Closed</p>
            <p className="text-xl font-bold text-gray-600">{stats.closed}</p>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select
              value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All Categories</option>
              <option value="Royalty & Payments">Royalty & Payments</option>
              <option value="ISBN & Metadata Issues">ISBN & Metadata</option>
              <option value="Printing & Quality">Printing & Quality</option>
              <option value="Distribution & Availability">Distribution</option>
              <option value="Book Status & Production Updates">Production Updates</option>
              <option value="General Inquiry">General</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
            <select
              value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="px-3 py-2 border rounded-lg text-sm w-48"
              />
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 mt-5">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Subject</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Author</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Priority</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/tickets/${ticket._id}`)}>
                <td className="px-4 py-3">
                  <p className="font-medium text-sm">{ticket.subject}</p>
                  {ticket.bookId && <p className="text-xs text-gray-400">{ticket.bookId.title}</p>}
                </td>
                <td className="px-4 py-3 text-sm">{ticket.authorId?.name}</td>
                <td className="px-4 py-3 text-sm">{ticket.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-indigo-600 text-sm hover:underline">View →</span>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No tickets found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
