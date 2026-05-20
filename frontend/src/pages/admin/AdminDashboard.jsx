import { Link } from 'react-router-dom';

function TicketIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M9 9h.01" /><path d="M15 9h.01" /><path d="M9 13a3 3 0 0 0 6 0" />
    </svg>
  );
}

function BotIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage support tickets, AI classifications, and author communications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/tickets"
          className="group relative bg-navy-800 rounded-2xl border border-navy-700 shadow-sm hover:shadow-xl hover:border-gold-500/30 transition-all duration-300 overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gold-500/10 text-gold-400 mb-5 group-hover:scale-110 group-hover:bg-gold-500/20 transition-all duration-300">
              <TicketIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-gold-400 transition-colors duration-200">
              Ticket Queue
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              View, filter, sort, and manage all incoming support tickets from authors. Monitor AI classifications and respond.
            </p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gold-400 group-hover:gap-2 transition-all duration-200">
              Open Queue
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500/40 to-gold-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        <div className="bg-navy-800 rounded-2xl border border-navy-700 shadow-sm p-6 sm:p-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-teal-500/10 text-teal-400 mb-5">
            <BotIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">AI-Powered Features</h3>
          <ul className="space-y-3">
            {[
              'Automatic ticket categorization on creation',
              'Priority scoring based on content analysis',
              'AI-generated draft responses using knowledge base',
              'One-click re-classification for accuracy',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                <svg className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
