import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AuthorDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/author/books" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">My Books</h2>
          <p className="text-gray-600">View your published books, royalties, and sales details.</p>
        </Link>
        <Link to="/author/new-ticket" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">Submit a Ticket</h2>
          <p className="text-gray-600">Raise a support query for any issue or question.</p>
        </Link>
        <Link to="/author/tickets" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">My Tickets</h2>
          <p className="text-gray-600">Track all your support tickets and admin responses.</p>
        </Link>
      </div>
    </div>
  );
}
