import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors = {
  'Published & Live': 'bg-green-100 text-green-800',
  'Cover Design': 'bg-yellow-100 text-yellow-800',
  'Typesetting': 'bg-blue-100 text-blue-800',
  'Proofreading': 'bg-purple-100 text-purple-800',
  'Manuscript Received': 'bg-gray-100 text-gray-800',
  'Editing': 'bg-orange-100 text-orange-800',
  'ISBN Assignment': 'bg-teal-100 text-teal-800',
  'Printing': 'bg-pink-100 text-pink-800',
  'Distribution Setup': 'bg-indigo-100 text-indigo-800',
};

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Books</h1>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Books</p>
            <p className="text-2xl font-bold">{summary.totalBooks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Copies Sold</p>
            <p className="text-2xl font-bold">{summary.totalCopiesSold}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Royalty Earned</p>
            <p className="text-2xl font-bold text-green-600">₹{summary.totalRoyaltyEarned.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Royalty Pending</p>
            <p className="text-2xl font-bold text-orange-600">₹{summary.totalRoyaltyPending.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ISBN</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Genre</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">MRP</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Sold</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Earned</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Paid</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Pending</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{book.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{book.isbn}</td>
                <td className="px-4 py-3 text-sm">{book.genre}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[book.status] || 'bg-gray-100'}`}>
                    {book.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">₹{book.mrp}</td>
                <td className="px-4 py-3 text-right">{book.copiesSold}</td>
                <td className="px-4 py-3 text-right text-green-600">₹{book.royaltyEarned.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">₹{book.royaltyPaid.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-orange-600 font-medium">
                  {book.royaltyPending > 0 ? `₹${book.royaltyPending.toLocaleString()}` : '-'}
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr><td colSpan="9" className="px-4 py-8 text-center text-gray-500">No books found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
