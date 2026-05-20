import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BookOpenIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function LayoutDashboardIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M9 13a3 3 0 0 0 6 0" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin' || path === '/author') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-white/15 text-white'
        : 'text-indigo-200 hover:text-white hover:bg-white/10'
    }`;

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-indigo-800 shadow-lg shadow-indigo-900/20 border-b border-indigo-600/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to={user?.role === 'admin' ? '/admin' : '/author'}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 text-white group-hover:bg-white/20 transition-all duration-200">
              <BookOpenIcon />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">BookLeaf</span>
              <span className="hidden sm:inline ml-1.5 text-indigo-300 text-sm font-medium">Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {user?.role === 'admin' ? (
              <>
                <Link to="/admin" className={linkClass('/admin')}>
                  <LayoutDashboardIcon />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to="/admin/tickets" className={linkClass('/admin/tickets')}>
                  <TicketIcon />
                  <span className="hidden sm:inline">Tickets</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/author" className={linkClass('/author')}>
                  <LayoutDashboardIcon />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to="/author/books" className={linkClass('/author/books')}>
                  <BookIcon />
                  <span className="hidden sm:inline">My Books</span>
                </Link>
                <Link to="/author/tickets" className={linkClass('/author/tickets')}>
                  <TicketIcon />
                  <span className="hidden sm:inline">My Tickets</span>
                </Link>
                <Link to="/author/new-ticket" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-white/15 text-white hover:bg-white/25 transition-all duration-200">
                  <PlusIcon />
                  <span className="hidden sm:inline">New Ticket</span>
                </Link>
              </>
            )}

            <div className="relative ml-2 sm:ml-4">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-indigo-200 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-white text-sm font-medium max-w-[120px] truncate">
                  {user?.name}
                </span>
                <ChevronDownIcon />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl shadow-black/10 border border-gray-100 py-1 z-20 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {user?.role === 'admin' ? 'Administrator' : 'Author'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <LogOutIcon />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
