import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function BookIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M9 13a3 3 0 0 0 6 0" />
    </svg>
  );
}

const cards = [
  {
    to: '/author/books',
    title: 'My Books',
    description: 'View your published books, track royalties, and monitor sales performance.',
    icon: BookIcon,
    gradient: 'from-gold-500 to-gold-600',
    lightBg: 'bg-gold-500/10',
    lightText: 'text-gold-400',
  },
  {
    to: '/author/new-ticket',
    title: 'Submit a Ticket',
    description: 'Raise a support query for any issue, question, or request regarding your books.',
    icon: PlusCircleIcon,
    gradient: 'from-teal-500 to-teal-600',
    lightBg: 'bg-teal-500/10',
    lightText: 'text-teal-400',
  },
  {
    to: '/author/tickets',
    title: 'My Tickets',
    description: 'Track all your support tickets and responses from the BookLeaf publishing team.',
    icon: TicketIcon,
    gradient: 'from-rose-500 to-rose-600',
    lightBg: 'bg-rose-500/10',
    lightText: 'text-rose-400',
  },
];

export default function AuthorDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-400 mt-1">Here's what you can do on the BookLeaf Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="group relative bg-navy-800 rounded-2xl shadow-sm border border-navy-700 hover:shadow-xl hover:border-gold-500/30 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${card.lightBg} ${card.lightText} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-gold-400 transition-colors duration-200">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
