import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, Users2, Lightbulb, Award, UserPlus } from 'lucide-react';

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the Current Affairs page
  const isCurrentAffairsPage = location.pathname === '/current-affairs';

  const navItems = [
    { label: 'Venues', path: '/all-hotels', icon: <Building2 className="h-5 w-5 mb-0.5 mx-auto" /> },
    { label: 'Vendors', path: '/vendors', icon: <Users2 className="h-5 w-5 mb-0.5 mx-auto" /> },
    { label: 'Current Affairs', path: '/current-affairs', icon: <Lightbulb className="h-5 w-5 mb-0.5 mx-auto" /> },
    { label: 'Awards', path: '/awards', icon: <Award className="h-5 w-5 mb-0.5 mx-auto" /> },
  ];

  const getLinkClass = (path: string, baseClass: string) => {
    return location.pathname === path
      ? `text-[#101c34] ${baseClass}`
      : `text-gray-700 hover:text-[#101c34] ${baseClass}`;
  };

  // When the logo/title is clicked: on mobile and already on the homepage, smooth-scroll to top.
  // Otherwise navigate to the homepage.
  const onLogoClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    // prevent the default Link navigation so we can handle SPA scroll vs navigate
    e.preventDefault();
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

    if (location.pathname === '/') {
      if (isMobile) {
        // Smooth scroll to top on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Desktop — already on home, do nothing (avoid a forced re-render)
      }
    } else {
      // Not on homepage — navigate there
      navigate('/');
    }
  };

  // Removed scroll listener entirely to ensure header does not animate or change state on scroll

  return (
    <header className="absolute inset-x-0 top-4 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto inline-flex w-full items-center justify-between py-2">
          <div className="w-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/70 px-4 py-2 flex items-center justify-between transition-all duration-300">
            {/* Logo */}
            <Link to="/" onClick={onLogoClick} className="flex items-center gap-3">
              <img src="/ght_logo.png" alt="GHT Logo" className="h-9" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Global Hotels and Tourism</h1>
                <p className="text-xs text-gray-600">Where Venue, Event & Wedding Planners Unite</p>
              </div>
            </Link>

            {/* Nav (centered) */}
            <nav className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className={getLinkClass(item.path, 'px-3 py-2 rounded-md text-sm flex flex-col items-center gap-0.5')}>
                  <span className="h-5 w-5 inline-flex items-center justify-center text-current">{item.icon}</span>
                  <span className="sr-only md:not-sr-only">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* CTA only (mobile menu removed - bottom nav available) */}
            <div className="flex items-center gap-3">
              <Link to="/join-as-vendor" className={`hidden md:inline-block bg-[#101c34] hover:bg-[#101c34] text-white px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/join-as-vendor' ? 'ring-2 ring-[#101c34]' : ''}`}>Join</Link>
            </div>
          </div>
        </div>

        {/* Mobile bottom nav is used; top hamburger removed */}
      </div>
    </header>
  );
};

export default Header;
