import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function BookOpen() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function PlusCircle() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function Tickets() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M9 13a3 3 0 0 0 6 0" />
    </svg>
  );
}

const actions = [
  { to: '/author/books', label: 'My Books', desc: 'Manage titles, track sales & royalties', icon: BookOpen, gradient: 'from-amber-500 to-orange-500' },
  { to: '/author/new-ticket', label: 'Submit Ticket', desc: 'Get help from the publishing team', icon: PlusCircle, gradient: 'from-emerald-500 to-teal-500' },
  { to: '/author/tickets', label: 'My Tickets', desc: 'View status of your support requests', icon: Tickets, gradient: 'from-rose-500 to-pink-500' },
];

export default function AuthorDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-8 sm:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-2">BookLeaf Portal</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Hey, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-400 mt-2 max-w-md">
              Welcome to your publishing hub. Track your books, connect with the team, and manage your royalties — all in one place.
            </p>
          </div>
          <Link
            to="/author/books"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gold-500 text-navy-950 rounded-xl font-semibold text-sm hover:bg-gold-400 transition-all duration-200 shrink-0"
          >
            <BookOpen />
            Go to My Books
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.to}
              to={a.to}
              className="group relative bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <Icon />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{a.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          );
        })}
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-navy-700 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Books', value: '4', color: 'text-gold-500' },
            { label: 'Copies Sold', value: '4,850', color: 'text-emerald-500' },
            { label: 'Royalty Earned', value: '₹3.2L', color: 'text-teal-500' },
            { label: 'Pending', value: '₹1.4L', color: 'text-rose-500' },
          ].map((s) => (
            <div key={s.label} className="text-center py-3">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
