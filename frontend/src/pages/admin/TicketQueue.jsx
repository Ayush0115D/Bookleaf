import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import socket from '../../services/socket';
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

const categories = [
  'Royalty & Payments',
  'ISBN & Metadata Issues',
  'Printing & Quality',
  'Distribution & Availability',
  'Book Status & Production Updates',
  'General Inquiry',
];

const priorities = ['Critical', 'High', 'Medium', 'Low'];
const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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

  const clearFilters = () => {
    setFilters({ status: '', category: '', priority: '' });
    setSearch('');
  };

  if (loading) return <LoadingSpinner />;

  const statCards = stats ? [
    { label: 'Total', value: stats.total, color: 'text-gray-900' },
    { label: 'Open', value: stats.open, color: 'text-amber-600' },
    { label: 'In Progress', value: stats.inProgress, color: 'text-blue-600' },
    { label: 'Resolved', value: stats.resolved, color: 'text-emerald-600' },
    { label: 'Closed', value: stats.closed, color: 'text-gray-600' },
  ] : [];

  const hasActiveFilters = filters.status || filters.category || filters.priority || search;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Ticket Queue</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and respond to author support tickets</p>
      </div>

      {stats && (
        <div className="grid grid-cols-5 gap-3 sm:gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 sm:p-4 text-center shadow-sm">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-xl sm:text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FilterIcon />
            Filters
          </div>

          <select
            value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Priorities</option>
            {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by subject or author..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-shadow duration-200"
              />
            </div>
            <button type="submit" className="bg-gold-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gold-700 transition-colors duration-200 shadow-sm shadow-gold-200">
              Search
            </button>
          </form>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline transition-colors">
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="px-4 sm:px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="hover:bg-gold-50/40 dark:hover:bg-gold-900/20 cursor-pointer transition-colors duration-150"
                  onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                >
                  <td className="px-4 sm:px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{ticket.subject}</p>
                    {ticket.bookId && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{ticket.bookId.title}</p>}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{ticket.authorId?.name}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">{ticket.category}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[ticket.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${priorityColors[ticket.priority] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-gold-600 dark:text-gold-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <TicketIcon />
                      <div>
                        <p className="text-gray-500 text-sm font-medium">No tickets found</p>
                        {hasActiveFilters && (
                          <button onClick={clearFilters} className="text-gold-600 text-sm hover:underline mt-1">
                            Try clearing your filters
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
