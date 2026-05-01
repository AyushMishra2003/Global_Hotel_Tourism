import { DashboardTabs } from '@/components/admin/DashboardTabs';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { role, email } = useAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Signed in as {email} ({role})</p>
        </div>
        <Link to="/admin" className="text-sm text-[#101c34] underline">Profile / OTP</Link>
      </div>
      <DashboardTabs />
    </div>
  );
};

export default AdminDashboard;
