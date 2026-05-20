import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors = {
  Open: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  Critical: 'bg-red-100 text-red-800',
  High: 'bg-orange-100 text-orange-800',
  Medium: 'bg-blue-100 text-blue-800',
  Low: 'bg-gray-100 text-gray-800',
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

  useEffect(() => {
    api.get(`/admin/tickets/${id}`)
      .then((res) => setTicket(res.data.ticket))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const generateDraft = async () => {
    setGenerating(true);
    try {
      const res = await api.post(`/admin/tickets/${id}/draft`);
      setDraft(res.data.draft);
    } catch (err) {
      setMessage('Failed to generate draft');
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
      setMessage('Response sent!');
    } catch (err) {
      setMessage('Failed to send response');
    } finally {
      setSending(false);
    }
  };

  const updateField = async (field, value) => {
    setUpdating(true);
    try {
      const res = await api.patch(`/admin/tickets/${id}`, { [field]: value });
      setTicket(res.data.ticket);
      setMessage(`${field} updated to "${value}"`);
    } catch (err) {
      setMessage('Update failed');
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
      setMessage('Internal note added');
    } catch (err) {
      setMessage('Failed to add note');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!ticket) return <div className="text-center py-12">Ticket not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <button onClick={() => navigate('/admin/tickets')} className="text-indigo-600 text-sm mb-4 hover:underline">
        ← Back to Queue
      </button>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[ticket.status]}`}>
                {ticket.status}
              </span>
              <span className={`px-3 py-1 rounded text-sm font-medium ${priorityColors[ticket.priority]}`}>
                {ticket.priority}
              </span>
              <span className="text-sm bg-gray-100 px-3 py-1 rounded">{ticket.category}</span>
              {ticket.aiClassified && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">AI Classified</span>
              )}
            </div>
            <h2 className="text-xl font-bold mb-2">{ticket.subject}</h2>
            {ticket.bookId && (
              <p className="text-sm text-gray-500 mb-2">
                Book: <span className="font-medium">{ticket.bookId.title}</span> (ISBN: {ticket.bookId.isbn})
              </p>
            )}
            <p className="text-sm text-gray-500 mb-4">
              Author: {ticket.authorId?.name} ({ticket.authorId?.email})
              {ticket.assignedTo && <> | Assigned to: {ticket.assignedTo.name}</>}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Original Description:</p>
              <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Created: {new Date(ticket.createdAt).toLocaleString()} |
              Updated: {new Date(ticket.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4">Conversation</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {ticket.messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'author' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'author' ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    <p className="text-xs font-medium mb-1 text-gray-500">
                      {msg.sender === 'author' ? ticket.authorId?.name : 'BookLeaf Admin'} — {new Date(msg.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4">Respond to Author</h3>
            <div className="mb-4">
              <button
                onClick={generateDraft} disabled={generating}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate AI Draft'}
              </button>
            </div>
            {draft && (
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-4">
                <p className="text-xs font-medium text-purple-600 mb-2">AI Draft Response:</p>
                <p className="text-sm whitespace-pre-wrap mb-3">{draft}</p>
                <button
                  onClick={() => setResponse(draft)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Use this draft
                </button>
              </div>
            )}
            <textarea
              value={response} onChange={(e) => setResponse(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm" rows="4"
              placeholder="Type your response..."
            />
            <button
              onClick={sendResponse} disabled={sending || !response.trim()}
              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Response'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">AI Assistant</h3>
              {ticket.aiClassified && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">AI Powered</span>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Classification</span>
                <span className="font-medium">{ticket.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Priority Score</span>
                <span className={`font-medium ${ticket.priority === 'Critical' ? 'text-red-600' : ticket.priority === 'High' ? 'text-orange-600' : ''}`}>
                  {ticket.priority}
                </span>
              </div>
              {ticket.aiClassified && (
                <p className="text-xs text-gray-400 italic">
                  AI auto-classified on creation. Use the dropdowns below to override.
                </p>
              )}
              <button
                onClick={async () => {
                  try {
                    setMessage('Re-classifying with AI...');
                    const res = await api.post(`/admin/tickets/${id}/reclassify`);
                    setTicket(res.data.ticket);
                    setMessage('AI re-classification complete');
                  } catch (err) {
                    setMessage('Re-classification failed');
                  }
                }}
                className="w-full bg-purple-600 text-white py-1.5 rounded text-sm hover:bg-purple-700"
              >
                Re-classify with AI
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4">Ticket Management</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={ticket.status} onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select
                  value={ticket.category} onChange={(e) => updateField('category', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                <select
                  value={ticket.priority} onChange={(e) => updateField('priority', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {updating && <p className="text-xs text-gray-400 mt-2">Updating...</p>}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4">Internal Notes</h3>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {ticket.internalNotes?.length === 0 && (
                <p className="text-sm text-gray-400">No internal notes</p>
              )}
              {ticket.internalNotes?.map((note, i) => (
                <div key={i} className="bg-yellow-50 p-3 rounded text-sm">
                  <p className="text-xs text-gray-500">{note.adminId?.name || 'Admin'} — {new Date(note.timestamp).toLocaleString()}</p>
                  <p className="mt-1">{note.text}</p>
                </div>
              ))}
            </div>
            <textarea
              value={internalNote} onChange={(e) => setInternalNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm" rows="2"
              placeholder="Add an internal note..."
            />
            <button
              onClick={addInternalNote} disabled={!internalNote.trim()}
              className="mt-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50"
            >
              Add Note
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4">Author Details</h3>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-500">Name:</span> {ticket.authorId?.name}</p>
              <p><span className="text-gray-500">Email:</span> {ticket.authorId?.email}</p>
              {ticket.authorId?.bankDetails && (
                <>
                  <p className="text-gray-500 mt-2 font-medium">Bank Details:</p>
                  <p>Account: {ticket.authorId.bankDetails.accountHolder}</p>
                  <p>Bank: {ticket.authorId.bankDetails.bankName}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
