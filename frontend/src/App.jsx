import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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

  const dashboardPath = user.role === 'admin' ? '/admin' : '/author';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to={dashboardPath} replace />} />
          <Route path="/login" element={<Navigate to={dashboardPath} replace />} />
          <Route path="/signup" element={<Navigate to={dashboardPath} replace />} />
          <Route path="/author" element={<AuthorDashboard />} />
          <Route path="/author/books" element={<MyBooks />} />
          <Route path="/author/new-ticket" element={<SubmitTicket />} />
          <Route path="/author/tickets" element={<MyTickets />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/tickets" element={<TicketQueue />} />
          <Route path="/admin/tickets/:id" element={<TicketDetail />} />
          <Route path="*" element={<Navigate to={dashboardPath} replace />} />
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
