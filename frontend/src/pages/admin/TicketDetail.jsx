import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors = {
  Open: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Closed: 'bg-gray-50 text-gray-700 border-gray-200',
};

const priorityColors = {
  Critical: 'bg-red-50 text-red-700 border-red-200',
  High: 'bg-orange-50 text-orange-700 border-orange-200',
  Medium: 'bg-blue-50 text-blue-700 border-blue-200',
  Low: 'bg-gray-50 text-gray-700 border-gray-200',
};

const categories = [
  'Royalty & Payments',
  'ISBN & Metadata Issues',
  'Printing & Quality',
  'Distribution & Availability',
  'Book Status & Production Updates',
  'General Inquiry',
];

const priorities = ['Critical', 'High', 'Medium', 'Low'];
const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [response, setResponse] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    api.get(`/admin/tickets/${id}`)
      .then((res) => setTicket(res.data.ticket))
      .catch(console.error)
      .finally(() => setLoading(false));

    api.get('/auth/admins')
      .then((res) => setAdmins(res.data.admins))
      .catch(() => {});
  }, [id]);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const generateDraft = async () => {
    setGenerating(true);
    try {
      const res = await api.post(`/admin/tickets/${id}/draft`);
      setDraft(res.data.draft);
      showMessage('AI draft generated successfully');
    } catch {
      showMessage('Failed to generate draft', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const sendResponse = async () => {
    if (!response.trim()) return;
    setSending(true);
    try {
      await api.post(`/admin/tickets/${id}/respond`, { text: response });
      const res = await api.get(`/admin/tickets/${id}`);
      setTicket(res.data.ticket);
      setResponse('');
      setDraft('');
      showMessage('Response sent to author');
    } catch {
      showMessage('Failed to send response', 'error');
    } finally {
      setSending(false);
    }
  };

  const updateField = async (field, value) => {
    setUpdating(true);
    try {
      const res = await api.patch(`/admin/tickets/${id}`, { [field]: value });
      setTicket(res.data.ticket);
      showMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`);
    } catch {
      showMessage('Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const addInternalNote = async () => {
    if (!internalNote.trim()) return;
    try {
      await api.patch(`/admin/tickets/${id}`, { internalNote });
      const res = await api.get(`/admin/tickets/${id}`);
      setTicket(res.data.ticket);
      setInternalNote('');
      showMessage('Internal note added');
    } catch {
      showMessage('Failed to add note', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!ticket) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">Ticket not found</p>
      <button onClick={() => navigate('/admin/tickets')} className="mt-4 text-gold-600 text-sm hover:underline">Back to Queue</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/admin/tickets')} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200">
          <ArrowLeftIcon />
          Back to Queue
        </button>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2 animate-slide-up ${
          messageType === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
        }`}>
          {messageType === 'success' ? (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${statusColors[ticket.status]}`}>
                {ticket.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${priorityColors[ticket.priority]}`}>
                {ticket.priority}
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-lg">{ticket.category}</span>
              {ticket.aiClassified && (
                <span className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <SparklesIcon />
                  AI Classified
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{ticket.subject}</h2>
            {ticket.bookId && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                <FileTextIcon />
                Book: <span className="font-medium text-gray-700 dark:text-gray-200">{ticket.bookId.title}</span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span className="font-mono text-xs">ISBN: {ticket.bookId.isbn}</span>
              </p>
            )}
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <UserIcon />
              {ticket.authorId?.name} ({ticket.authorId?.email})
              {ticket.assignedTo && <><span className="text-gray-300 dark:text-gray-600">·</span> Assigned to: <span className="font-medium text-gray-700 dark:text-gray-200">{ticket.assignedTo.name}</span></>}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Original Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center gap-3">
              <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
              <span>Updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Conversation
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {ticket.messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'author' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.sender === 'author' ? 'bg-gold-600 text-white rounded-br-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
                  }`}>
                    <p className={`text-xs font-medium mb-1.5 ${msg.sender === 'author' ? 'text-gold-200' : 'text-gray-500 dark:text-gray-400'}`}>
                      {msg.sender === 'author' ? ticket.authorId?.name : 'BookLeaf Admin'} — {new Date(msg.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {ticket.messages.length === 0 && (
                <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">No messages yet. Be the first to respond.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Respond to Author</h3>
            <div className="mb-4 flex items-center gap-3">
              <button
                onClick={generateDraft} disabled={generating}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-purple-200"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    Generate AI Draft
                  </>
                )}
              </button>
            </div>
            {draft && (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-4 animate-slide-up">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
                    <SparklesIcon />
                    AI Draft Response
                  </p>
                  <button
                    onClick={() => setResponse(draft)}
                    className="text-xs text-gold-600 hover:text-gold-800 font-medium transition-colors"
                  >
                    Use this draft →
                  </button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{draft}</p>
              </div>
            )}
            <textarea
              value={response} onChange={(e) => setResponse(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-shadow duration-200" rows="4"
              placeholder="Type your response..."
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={sendResponse} disabled={sending || !response.trim()}
                className="inline-flex items-center gap-2 bg-gold-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-gold-200"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <SendIcon />
                    Send Response
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BotIcon />
                AI Assistant
              </h3>
              {ticket.aiClassified && (
                <span className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <SparklesIcon />
                  Powered
                </span>
              )}
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">Classification</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.category}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">Priority Score</span>
                <span className={`font-medium ${ticket.priority === 'Critical' ? 'text-red-600' : ticket.priority === 'High' ? 'text-orange-600' : 'text-gray-900 dark:text-gray-100'}`}>
                  {ticket.priority}
                </span>
              </div>
              {ticket.aiClassified && (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                  AI auto-classified on creation. Use the dropdowns below to override.
                </p>
              )}
              <button
                onClick={async () => {
                  try {
                    showMessage('Re-classifying with AI...');
                    const res = await api.post(`/admin/tickets/${id}/reclassify`);
                    setTicket(res.data.ticket);
                    showMessage('AI re-classification complete');
                  } catch {
                    showMessage('Re-classification failed', 'error');
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-all duration-200 shadow-sm shadow-purple-200"
              >
                <SparklesIcon />
                Re-classify with AI
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Ticket Management</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={ticket.status} onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={ticket.category} onChange={(e) => updateField('category', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Priority</label>
                <select
                  value={ticket.priority} onChange={(e) => updateField('priority', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
                >
                  {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Assigned To</label>
                <select
                  value={ticket.assignedTo?._id || ''} onChange={(e) => updateField('assignedTo', e.target.value || null)}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Unassigned</option>
                  {admins.map((admin) => (
                    <option key={admin._id} value={admin._id}>{admin.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {updating && (
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 dark:text-gray-500">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Updating...
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Internal Notes</h3>
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
              {ticket.internalNotes?.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No internal notes</p>
              )}
              {ticket.internalNotes?.map((note, i) => (
                <div key={i} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-3 rounded-xl text-sm animate-fade-in">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-center text-[10px] font-bold">
                      {note.adminId?.name?.charAt(0) || 'A'}
                    </span>
                    {note.adminId?.name || 'Admin'} — {new Date(note.timestamp).toLocaleString()}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{note.text}</p>
                </div>
              ))}
            </div>
            <textarea
              value={internalNote} onChange={(e) => setInternalNote(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-shadow duration-200" rows="2"
              placeholder="Add an internal note..."
            />
            <button
              onClick={addInternalNote} disabled={!internalNote.trim()}
              className="mt-2 w-full bg-gray-700 text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Add Note
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <UserIcon />
              Author Details
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 w-16 shrink-0">Name</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{ticket.authorId?.name}</span>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 w-16 shrink-0">Email</span>
                <span className="text-gray-700 dark:text-gray-300">{ticket.authorId?.email}</span>
              </div>
              {ticket.authorId?.bankDetails && (
                <>
                  <div className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 w-16 shrink-0">Account</span>
                    <span className="text-gray-700 dark:text-gray-300">{ticket.authorId.bankDetails.accountHolder}</span>
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <span className="text-gray-500 dark:text-gray-400 w-16 shrink-0">Bank</span>
                    <span className="text-gray-700 dark:text-gray-300">{ticket.authorId.bankDetails.bankName}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
