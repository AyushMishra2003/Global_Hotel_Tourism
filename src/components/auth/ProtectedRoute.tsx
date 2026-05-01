import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { loading, authenticated } = useAuth();
  if(loading) return <div className="p-8 text-sm">Loading auth...</div>;
  if(!authenticated) return <Navigate to="/admin" replace />;
  return <>{children}</>;
};
