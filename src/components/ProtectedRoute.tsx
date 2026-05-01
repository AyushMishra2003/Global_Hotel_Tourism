import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { authenticated, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  return authenticated ? children : <Navigate to="/admin" replace />;
}
