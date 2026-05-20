import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={user?.role === 'admin' ? '/admin' : '/author'} className="font-bold text-xl">
            BookLeaf Portal
          </Link>
          <div className="flex items-center gap-6">
            {user?.role === 'admin' ? (
              <>
                <Link to="/admin" className="hover:text-indigo-200">Dashboard</Link>
                <Link to="/admin/tickets" className="hover:text-indigo-200">Tickets</Link>
              </>
            ) : (
              <>
                <Link to="/author" className="hover:text-indigo-200">Dashboard</Link>
                <Link to="/author/books" className="hover:text-indigo-200">My Books</Link>
                <Link to="/author/tickets" className="hover:text-indigo-200">My Tickets</Link>
                <Link to="/author/new-ticket" className="hover:text-indigo-200">New Ticket</Link>
              </>
            )}
            <span className="text-sm opacity-80">{user?.name}</span>
            <button onClick={handleLogout} className="bg-indigo-600 px-3 py-1 rounded text-sm hover:bg-indigo-500">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
