import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/tickets" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">Ticket Queue</h2>
          <p className="text-gray-600">View, filter, and manage all incoming support tickets.</p>
        </Link>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Quick Actions</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>→ Go to <Link to="/admin/tickets" className="text-indigo-600 hover:underline">Ticket Queue</Link> to view new tickets</li>
            <li>→ Click any ticket to view AI classification, priority, and draft response</li>
            <li>→ Override AI suggestions and respond to authors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
