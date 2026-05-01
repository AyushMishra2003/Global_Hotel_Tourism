import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function JoinPopup() {
  const [visible, setVisible] = useState(false);

  const location = useLocation();

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('joinPopupDismissed');
      if (dismissed) return;
    } catch (e) {
      // ignore storage errors
    }

    // If popup already visible, don't schedule another
    if (visible) return;

    const timer = window.setTimeout(() => setVisible(true), 5000);

    return () => window.clearTimeout(timer as unknown as number);
    // re-run when the pathname changes so the popup can appear on new pages
  }, [location.pathname, visible]);

  const close = (persist = true) => {
    setVisible(false);
    if (persist) {
      try { sessionStorage.setItem('joinPopupDismissed', '1'); } catch(e){ /* ignore storage errors */ }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => close(false)} />
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 relative z-10">
        <button className="absolute top-3 right-3 text-gray-600" onClick={() => close()} aria-label="Close">
          ✕
        </button>
        <div className="flex items-start gap-4">
          <img src="/ght_logo.png" alt="GHT" className="h-12 w-12 object-contain" />
          <div>
            <h3 className="text-xl font-semibold">Join Global Hotels & Tourism</h3>
            <p className="text-sm text-gray-600 mt-1">Become a vendor and reach thousands of planners and travellers.</p>
            <div className="mt-4 flex gap-3">
              <Link to="/join-as-vendor" className="bg-[#101c34] hover:bg-[#101c34] text-white px-4 py-2 rounded-md font-medium" onClick={() => close()}>
                Join as Vendor
              </Link>
              <button className="px-4 py-2 rounded-md border" onClick={() => close()}>Maybe later</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
