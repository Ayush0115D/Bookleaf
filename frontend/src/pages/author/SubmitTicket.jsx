import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function SendIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function SubjectIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function DescriptionIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

export default function SubmitTicket() {
  const [books, setBooks] = useState([]);
  const [bookId, setBookId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/books').then((res) => setBooks(res.data.books)).catch(console.error);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowed.includes(selected.type)) {
        setError('Invalid file type. Allowed: JPEG, PNG, GIF, PDF, DOC, DOCX');
        e.target.value = '';
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setError('File too large. Maximum size is 10MB');
        e.target.value = '';
        return;
      }
      setFile(selected);
      setError('');
    }
  };

  const removeFile = () => {
    setFile(null);
    document.getElementById('file-input').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (bookId) formData.append('bookId', bookId);
      formData.append('subject', subject);
      formData.append('description', description);
      if (file) formData.append('attachment', file);

      await api.post('/tickets', formData);
      setSuccess(true);
      setTimeout(() => navigate('/author/tickets'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-100 dark:border-emerald-900 shadow-sm p-8 sm:p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-5">
            <CheckCircleIcon />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Ticket Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Your support query has been received. You'll be redirected shortly.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-medium">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Submit a Support Query</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Fill out the form below and our team will get back to you</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Related Book</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <BookIcon />
            </div>
            <select
              value={bookId} onChange={(e) => setBookId(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-shadow duration-200 appearance-none"
            >
              <option value="">General / Account Level</option>
              {books.map((book) => (
                <option key={book._id} value={book._id}>{book.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <SubjectIcon />
            </div>
            <input
              type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-shadow duration-200"
              placeholder="Brief summary of your issue" required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
          <div className="relative">
            <div className="absolute top-3 left-3.5 flex items-start pointer-events-none">
              <DescriptionIcon />
            </div>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-shadow duration-200" required rows="6"
              placeholder="Describe your issue in detail. Include any relevant information that might help us resolve your query faster."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Attachment (optional)</label>
          {file ? (
            <div className="flex items-center gap-3 px-4 py-3 border border-gold-400 bg-gold-50/50 dark:bg-gold-900/20 rounded-xl">
              <AttachIcon />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button type="button" onClick={removeFile} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-gold-400 hover:bg-gold-50/50 dark:hover:bg-gold-900/20 transition-all duration-200">
              <AttachIcon />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload a file</p>
                <p className="text-xs text-gray-400">PDF, PNG, JPG up to 10MB</p>
              </div>
              <input id="file-input" type="file" onChange={handleFileChange} className="hidden" accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx" />
            </label>
          )}
        </div>

        <button
          type="submit" disabled={submitting}
          className="w-full bg-gold-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-gold-200 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <SendIcon />
              Submit Ticket
            </>
          )}
        </button>
      </form>
    </div>
  );
}
