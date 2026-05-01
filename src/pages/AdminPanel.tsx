import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const { authenticated, email: authedEmail, role, refresh, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/backend/api/auth/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Logged in as ' + data.data.email + ' (' + data.data.role + ')');
        refresh();
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Login error');
    }
    setLoading(false);
  };

  const logout = async () => {
    await fetch('/backend/api/auth/logout.php');
    refresh();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      {message && <div className="mb-4 text-sm text-blue-700">{message}</div>}
      {!authenticated && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="border rounded px-3 py-2 w-full" placeholder="admin email" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border rounded px-3 py-2 w-full" placeholder="password" />
          </div>
          <button onClick={login} disabled={loading} className="bg-[#101c34] text-white px-4 py-2 rounded">{loading ? 'Logging in...' : 'Login'}</button>
        </div>
      )}
      {authenticated && (
        <div className="space-y-6">
          <div className="p-4 border rounded bg-gray-50">
            <p className="text-sm">Signed in as</p>
            <p className="font-medium">{authedEmail}</p>
            <p className="text-xs uppercase tracking-wide text-gray-500">Role: {role}</p>
            <button onClick={logout} className="mt-3 text-red-600 underline text-sm">Logout</button>
          </div>
          {role === 'admin' && (
            <Link to="/admin/dashboard" className="inline-block bg-[#101c34] text-white text-sm px-4 py-2 rounded">Go to Dashboard</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
