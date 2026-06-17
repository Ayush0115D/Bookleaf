import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors = {
  'Published & Live': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Cover Design': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Typesetting': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Proofreading': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Manuscript Received': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  'Editing': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'ISBN Assignment': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'Printing': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Distribution Setup': 'bg-gold-500/10 text-gold-400 border-gold-500/20',
};

function BookIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', isbn: '', genre: '', mrp: '', publishDate: '', status: 'Manuscript Received', copiesSold: '', royaltyEarned: '', royaltyPaid: '', royaltyPending: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    setLoading(true);
    api.get('/books')
      .then((res) => {
        setBooks(res.data.books);
        setSummary(res.data.summary);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/books', {
        ...form,
        mrp: Number(form.mrp),
        copiesSold: form.copiesSold ? Number(form.copiesSold) : 0,
        royaltyEarned: form.royaltyEarned ? Number(form.royaltyEarned) : 0,
        royaltyPaid: form.royaltyPaid ? Number(form.royaltyPaid) : 0,
        royaltyPending: form.royaltyPending ? Number(form.royaltyPending) : 0,
        publishDate: form.publishDate || undefined,
      });
      setShowModal(false);
      setForm({ title: '', isbn: '', genre: '', mrp: '', publishDate: '', status: 'Manuscript Received', copiesSold: '', royaltyEarned: '', royaltyPaid: '', royaltyPending: '' });
      loadBooks();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to add book');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = summary ? [
    { label: 'Total Books', value: summary.totalBooks, icon: BookIcon, color: 'text-gold-600', bg: 'bg-gold-50 dark:bg-gold-500/10' },
    { label: 'Copies Sold', value: summary.totalCopiesSold, icon: TrendingUpIcon, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Royalty Earned', value: `₹${summary.totalRoyaltyEarned.toLocaleString()}`, icon: DollarIcon, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Royalty Pending', value: `₹${summary.totalRoyaltyPending.toLocaleString()}`, icon: ClockIcon, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Books</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your published books, royalties, and production status</p>
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white dark:bg-navy-800 rounded-xl border border-gray-100 dark:border-navy-700 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.bg} p-2.5 rounded-lg`}>
                    <Icon />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-navy-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Books</h2>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or ISBN..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40 transition-all duration-200"
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-sm font-medium transition-colors duration-200 whitespace-nowrap"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Book
              </button>
            </div>
          </div>
        </div>

        {/* Add Book Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-[10vh]">
            <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-navy-700 w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-navy-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add New Book</h3>
                <button onClick={() => { setShowModal(false); setError(''); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} required
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">ISBN *</label>
                  <input type="text" name="isbn" value={form.isbn} onChange={handleChange} required
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Genre *</label>
                  <input type="text" name="genre" value={form.genre} onChange={handleChange} required
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">MRP (₹) *</label>
                  <input type="number" name="mrp" value={form.mrp} onChange={handleChange} required min="0" step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Copies Sold</label>
                  <input type="number" name="copiesSold" value={form.copiesSold} onChange={handleChange} min="0"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Total Money Earned (₹)</label>
                  <input type="number" name="royaltyEarned" value={form.royaltyEarned} onChange={handleChange} min="0"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Already Received (₹)</label>
                  <input type="number" name="royaltyPaid" value={form.royaltyPaid} onChange={handleChange} min="0"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Still Left to Get (₹)</label>
                  <input type="number" name="royaltyPending" value={form.royaltyPending} onChange={handleChange} min="0"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Publish Date</label>
                  <input type="date" name="publishDate" value={form.publishDate} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                  <select name="status" value={form.status} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40"
                  >
                    {Object.keys(statusColors).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); setError(''); }}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 disabled:bg-gold-600/50 text-white rounded-xl text-sm font-medium transition-colors duration-200"
                  >
                    {submitting ? 'Adding...' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-navy-700">
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">ISBN</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Genre</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">MRP</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Sold</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Earned</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Received</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-navy-700/50">
              {filteredBooks.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 dark:hover:bg-navy-700/30 transition-colors duration-150">
                  <td className="px-4 sm:px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{book.title}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell font-mono">{book.isbn}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">{book.genre}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[book.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-gray-100">₹{book.mrp}</td>
                  <td className="px-4 sm:px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">{book.copiesSold}</td>
                  <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium text-emerald-600">₹{book.royaltyEarned.toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300 hidden lg:table-cell">₹{book.royaltyPaid.toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    {book.royaltyPending > 0 ? (
                      <span className="text-sm font-medium text-amber-600">₹{book.royaltyPending.toLocaleString()}</span>
                    ) : (
                      <span className="text-sm text-gray-600 dark:text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <BookIcon />
                      <p className="text-gray-500 text-sm">No books found</p>
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
