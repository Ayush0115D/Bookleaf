import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function SettingsIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function BookLeafLogo() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-gold-500/15" />
      <path d="M8 12c0-1.1.9-2 2-2h3a4 4 0 0 1 3 1.4A4 4 0 0 1 19 10h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3a4 4 0 0 0-4 0 4 4 0 0 0-4 0H10a2 2 0 0 1-2-2v-9z" fill="currentColor" className="text-gold-500/20" />
      <path d="M16 12v11" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 13h4" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 16h4" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 19h4" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 13h4" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 16h4" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 19h4" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 8l-1.5 1.5M22 8l1.5 1.5" stroke="currentColor" className="text-gold-400" strokeWidth="1.2" strokeLinecap="round" />
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function LayoutDashboardIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M9 9h.01" /><path d="M15 9h.01" /><path d="M9 13a3 3 0 0 0 6 0" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin' || path === '/author') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    `flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-gold-500/10 text-gold-400'
        : 'text-gray-400 hover:text-gold-400 hover:bg-gold-500/5'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gold-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            to={user?.role === 'admin' ? '/admin' : '/author'}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-500/10 text-gold-500 group-hover:bg-gold-500/20 transition-all duration-200">
              <BookLeafLogo />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white">BookLeaf</span>
              <span className="hidden sm:inline ml-1.5 text-gray-500 text-xs font-medium">Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-1">
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
                <Link to="/author/new-ticket" className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 transition-all duration-200">
                  <PlusIcon />
                  <span className="hidden sm:inline">New Ticket</span>
                </Link>
              </>
            )}

            <div className="h-5 w-px bg-gray-700/50 mx-1 sm:mx-2" />

            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gold-400 hover:bg-gold-500/5 transition-all duration-200"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gold-400 hover:bg-gold-500/5 transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-white text-[10px] font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-gray-300 text-sm font-medium max-w-[100px] truncate">
                  {user?.name}
                </span>
                <ChevronDownIcon />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-navy-800 border border-gold-500/10 shadow-2xl shadow-black/40 py-1 z-20 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gold-500/10">
                      <p className="text-sm font-semibold text-gray-100 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-gold-500/10 text-gold-400">
                        {user?.role === 'admin' ? 'Administrator' : 'Author'}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-gold-500/10 hover:text-gold-400 transition-colors duration-150"
                    >
                      <SettingsIcon />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors duration-150"
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
