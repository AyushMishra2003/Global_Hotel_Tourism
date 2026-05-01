import { useState } from 'react';
import VendorsTable from './VendorsTable';
import HotelsTable from './HotelsTable';
import CurrentAffairsManager from './CurrentAffairsManager';

export const DashboardTabs = () => {
  const [tab, setTab] = useState<'vendors' | 'hotels' | 'currentaffairs'>('vendors');
  const tabs: [string, string][] = [ 
    ['vendors', 'Vendors'], 
    ['hotels', 'Hotels'],
    ['currentaffairs', 'Current Affairs']
  ];
  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b">
        {tabs.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k as 'vendors' | 'hotels' | 'currentaffairs')} className={`px-3 py-2 text-sm -mb-px border-b-2 ${tab === k ? 'border-[#101c34] text-[#101c34] font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{label}</button>
        ))}
      </div>
      {tab === 'vendors' && <VendorsTable />}
      {tab === 'hotels' && <HotelsTable />}
      {tab === 'currentaffairs' && <CurrentAffairsManager />}
    </div>
  );
};
