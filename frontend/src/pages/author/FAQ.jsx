import { useState } from 'react';

const faqs = [
  {
    category: 'Royalty & Payments',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    items: [
      { q: 'When will I receive my royalty payment?', a: 'Royalties are paid as per the payment cycle mentioned in your author agreement. You can track royalty status in the My Books section.' },
      { q: 'Why is my royalty showing as pending?', a: 'Royalties remain pending until the payout threshold is met and processed by the finance team. Once processed, they move to paid status.' },
      { q: 'How is royalty calculated?', a: 'Royalty is calculated based on net sales as per your contract terms. Check your agreement for exact percentage details.' },
    ],
  },
  {
    category: 'ISBN & Metadata Issues',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    items: [
      { q: 'How do I get an ISBN for my book?', a: 'BookLeaf assigns ISBNs as part of the publishing process. If you need to update ISBN details, raise a ticket with ISBN & Metadata Issues category.' },
      { q: 'Can I correct book metadata after publication?', a: 'Minor metadata corrections may be possible depending on distribution channels. Contact support with specific details.' },
      { q: 'My book shows wrong title/author name online?', a: 'Metadata updates take time to reflect across all retailers. If incorrect after a reasonable time, raise a support ticket.' },
    ],
  },
  {
    category: 'Printing & Quality',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    ),
    items: [
      { q: 'I received a damaged copy, what should I do?', a: 'Share photos of the damaged copy and packaging via a support ticket under Printing & Quality. Our team will guide you on replacement.' },
      { q: 'What paper/quality options are available?', a: 'BookLeaf offers standard printing options as per your package. For specific queries, raise a ticket with details.' },
      { q: 'Can I order author copies?', a: 'Yes, you can request author copies through support. Pricing and shipping details will be shared.' },
    ],
  },
  {
    category: 'Distribution & Availability',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
      </svg>
    ),
    items: [
      { q: 'Where is my book available for sale?', a: 'Once live, books appear on BookLeaf store and partner platforms based on distribution rights.' },
      { q: 'My book is not showing on some platforms?', a: 'Distribution to all platforms can take a few days after going live. If it persists beyond expected time, raise a ticket.' },
      { q: 'Can I check sales across platforms?', a: 'Sales data shown in My Books reflects consolidated reports as updated by the team.' },
    ],
  },
  {
    category: 'Book Status & Production Updates',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    items: [
      { q: 'How can I track my book production status?', a: 'Your book status is updated in the My Books section as it moves through production stages.' },
      { q: 'What do different statuses mean?', a: 'Statuses like Cover Design, Typesetting, Proofreading, and Published & Live indicate where your book is in the publishing workflow.' },
      { q: 'How long does production take?', a: 'Timelines depend on the package and revision rounds. Check your agreement or raise a ticket for specific updates.' },
    ],
  },
  {
    category: 'General Inquiry',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    items: [
      { q: 'How do I raise a support ticket?', a: 'Go to "New Ticket" from the navbar or dashboard, select a book (optional), add subject/description and attach files if needed.' },
      { q: 'How do I track my ticket?', a: 'All your tickets are listed under "My Tickets" with real-time status updates and conversation history.' },
      { q: 'Can I reply to a ticket after resolution?', a: 'Resolved tickets cannot be replied to directly. If needed, raise a new ticket with reference to the previous one.' },
    ],
  },
];

function ChevronDownIcon({ open }) {
  return (
    <svg className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState(faqs[0].category);

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeSection = faqs.find((f) => f.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 text-white mb-4 shadow-lg shadow-gold-500/25">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">Frequently Asked Questions</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">Quick answers to the most common questions about publishing, royalties, and support</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden sticky top-20">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Categories</h2>
            </div>
            <div className="p-2">
              {faqs.map((section) => (
                <button
                  key={section.category}
                  onClick={() => setActiveCategory(section.category)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                    activeCategory === section.category
                      ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                    activeCategory === section.category
                      ? 'bg-gold-500/20 text-gold-600 dark:text-gold-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {section.icon}
                  </div>
                  <span className="text-sm font-medium flex-1">{section.category}</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gold-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10 text-gold-600 dark:text-gold-400">
                  {activeSection?.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{activeSection?.category}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activeSection?.items.length} questions</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {activeSection?.items.map((item, idx) => {
                const key = `${activeSection.category}-${idx}`;
                const isOpen = openItems[key];
                return (
                  <div key={key} className="group">
                    <button
                      onClick={() => toggleItem(key)}
                      className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left hover:bg-gold-50/40 dark:hover:bg-gold-900/10 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-semibold">
                          {idx + 1}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100 leading-relaxed">{item.q}</span>
                      </div>
                      <div className={`mt-0.5 text-gray-400 group-hover:text-gold-500 transition-colors ${isOpen ? 'text-gold-500' : ''}`}>
                        <ChevronDownIcon open={isOpen} />
                      </div>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-5 ml-9 text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
