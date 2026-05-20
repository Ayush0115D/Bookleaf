import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function BookLeafLogo() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
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

function UserIcon() {
  return (
    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/author', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface dark:bg-surface-dark">
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-600/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
              <BookLeafLogo />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BookLeaf</h1>
              <p className="text-gray-500 text-xs">Publishing Portal</p>
            </div>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Why join BookLeaf?</h2>
            <ul className="space-y-3">
              {[
                'Track your published books in real-time',
                'Monitor royalties and payment status',
                'Get AI-powered support for your queries',
                'Direct communication with the publishing team',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                  <svg className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-surface dark:bg-surface-dark">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold-500/10 mb-4">
              <BookLeafLogo />
            </div>
            <h1 className="text-xl font-bold text-white">Create account</h1>
            <p className="text-gray-500 text-sm mt-1">Join BookLeaf as an author</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-xl font-bold text-white">Create account</h1>
            <p className="text-gray-500 text-sm mt-1">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide uppercase">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon />
                </div>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-navy-800 border border-navy-600 rounded-xl text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-200"
                  placeholder="John Doe" required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide uppercase">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-navy-800 border border-navy-600 rounded-xl text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-200"
                  placeholder="you@company.com" required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide uppercase">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 bg-navy-800 border border-navy-600 rounded-xl text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-200"
                  placeholder="At least 6 characters" required minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  <span className="w-4 h-4 block">{showPassword ? <EyeOffIcon /> : <EyeIcon />}</span>
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-navy-950 py-2.5 rounded-xl font-semibold text-sm hover:from-gold-500 hover:to-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:ring-offset-2 focus:ring-offset-surface dark:focus:ring-offset-surface-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 glow-gold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-400 font-medium hover:text-gold-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
