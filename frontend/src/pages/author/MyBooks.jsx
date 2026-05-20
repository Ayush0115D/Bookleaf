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

  useEffect(() => {
    api.get('/books')
      .then((res) => {
        setBooks(res.data.books);
        setSummary(res.data.summary);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = summary ? [
    { label: 'Total Books', value: summary.totalBooks, icon: BookIcon, color: 'text-gold-600', bg: 'bg-gold-50' },
    { label: 'Copies Sold', value: summary.totalCopiesSold, icon: TrendingUpIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Royalty Earned', value: `₹${summary.totalRoyaltyEarned.toLocaleString()}`, icon: DollarIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Royalty Pending', value: `₹${summary.totalRoyaltyPending.toLocaleString()}`, icon: ClockIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">My Books</h1>
        <p className="text-gray-400 mt-1">Track your published books, royalties, and production status</p>
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-navy-800 rounded-xl border border-navy-700 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.bg} p-2.5 rounded-lg`}>
                    <Icon />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-navy-800 rounded-2xl border border-navy-700 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-navy-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-100">All Books</h2>
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or ISBN..."
                className="w-full pl-10 pr-4 py-2 border border-navy-600 bg-navy-700 text-gray-100 rounded-xl text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/40 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-700">
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">ISBN</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Genre</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">MRP</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Sold</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Earned</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Paid</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {filteredBooks.map((book) => (
                <tr key={book._id} className="hover:bg-navy-700/30 transition-colors duration-150">
                  <td className="px-4 sm:px-6 py-4">
                    <p className="font-medium text-gray-100 text-sm">{book.title}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-400 hidden sm:table-cell font-mono">{book.isbn}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-300 hidden md:table-cell">{book.genre}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[book.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium">₹{book.mrp}</td>
                  <td className="px-4 sm:px-6 py-4 text-right text-sm text-gray-300 hidden sm:table-cell">{book.copiesSold}</td>
                  <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium text-emerald-600">₹{book.royaltyEarned.toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-4 text-right text-sm text-gray-300 hidden lg:table-cell">₹{book.royaltyPaid.toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    {book.royaltyPending > 0 ? (
                      <span className="text-sm font-medium text-amber-600">₹{book.royaltyPending.toLocaleString()}</span>
                    ) : (
                      <span className="text-sm text-gray-300">—</span>
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
