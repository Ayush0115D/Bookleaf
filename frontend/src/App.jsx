import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AuthorDashboard from './pages/author/AuthorDashboard';
import MyBooks from './pages/author/MyBooks';
import SubmitTicket from './pages/author/SubmitTicket';
import MyTickets from './pages/author/MyTickets';
import AdminDashboard from './pages/admin/AdminDashboard';
import TicketQueue from './pages/admin/TicketQueue';
import TicketDetail from './pages/admin/TicketDetail';
import LoadingSpinner from './components/LoadingSpinner';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/author'} replace />;
}

function AppLayout() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/author" element={<ProtectedRoute><AuthorDashboard /></ProtectedRoute>} />
          <Route path="/author/books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path="/author/new-ticket" element={<ProtectedRoute><SubmitTicket /></ProtectedRoute>} />
          <Route path="/author/tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/tickets" element={<ProtectedRoute adminOnly><TicketQueue /></ProtectedRoute>} />
          <Route path="/admin/tickets/:id" element={<ProtectedRoute adminOnly><TicketDetail /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
