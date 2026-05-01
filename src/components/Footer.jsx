import { Link } from 'react-router-dom';
import logo from '../assets/logoremove.png';

const quickLinks = [
  { label: 'New Delhi',      to: '/city-hotels/new-delhi'  },
  { label: 'Uttarakhand',    to: '/city-hotels/uttarakhand' },
  { label: 'Jim Corbett',    to: '/city-hotels/jim-corbett' },
  { label: 'Agra',           to: '/city-hotels/agra'        },
  { label: 'Goa',            to: '/city-hotels/goa'         },
  { label: 'Blogs',          to: '/blogs'                   },
];

const vendorLinks = [
  { label: 'Event Planners', to: '/vendors/event-planners' },
  { label: 'All Vendors',    to: '/vendors'                },
  { label: 'Awards',         to: '/awards'                 },
  { label: 'Current Affairs',to: '/current-affairs'        },
  { label: 'About Us',       to: '/about'                  },
  { label: 'Join as Vendor', to: '/join-as-vendor'         },
];

const Footer = () => (
  <footer className="bg-gradient-to-br from-[#0d1626] via-[#101c34] to-[#162440] text-white">
    <div className="max-w-7xl mx-auto px-6 pt-14 pb-6">

      {/* ── Main grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

        {/* Brand */}
        <div className="lg:col-span-1 flex flex-col items-center md:items-start gap-4">
          <Link to="/" className="flex flex-col items-center md:items-start gap-2">
            <img src={logo} alt="GHT Logo" className="h-16 w-auto object-contain" />
          </Link>
          <p className="text-white/60 text-sm leading-relaxed text-center md:text-left max-w-[220px]">
            Where Venue, Event &amp; Wedding Planners Unite — your trusted partner for every celebration.
          </p>
          {/* Socials */}
          <div className="flex gap-3 mt-1">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center hover:bg-white/15 hover:border-white/50 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center hover:bg-white/15 hover:border-white/50 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/globalhotelsandtourism/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center hover:bg-white/15 hover:border-white/50 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold text-base mb-4 uppercase tracking-widest text-xs">Destinations</h3>
          <ul className="space-y-2">
            {quickLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-white/60 text-sm hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Vendor / Company Links */}
        <div>
          <h3 className="text-white font-bold text-base mb-4 uppercase tracking-widest text-xs">Company</h3>
          <ul className="space-y-2">
            {vendorLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-white/60 text-sm hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold text-base mb-4 uppercase tracking-widest text-xs">Contact</h3>
          <ul className="space-y-4">

            <li>
              <a href="mailto:contact@globalhotelsandtourism.com"
                className="flex items-start gap-3 text-white/60 hover:text-white transition-colors group">
                <span className="w-8 h-8 rounded-full border border-white/20 group-hover:border-white/50 group-hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-all mt-0.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <span className="text-sm leading-snug break-all">contact@globalhotelsandtourism.com</span>
              </a>
            </li>

            <li>
              <a href="tel:+919810261007"
                className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                <span className="w-8 h-8 rounded-full border border-white/20 group-hover:border-white/50 group-hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-all">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 12 19.79 19.79 0 0 1 1.04 3.41 2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span className="text-sm">+91-9810261007</span>
              </a>
            </li>

            <li>
              <a href="https://wa.me/918076885774" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
                <span className="w-8 h-8 rounded-full border border-white/20 group-hover:border-white/50 group-hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-all">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </span>
                <span className="text-sm">+91-8076885774 (WhatsApp)</span>
              </a>
            </li>

          </ul>
        </div>

      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/40 text-xs">
          © {new Date().getFullYear()} Global Hotels &amp; Tourism. All rights reserved.
        </p>
        <div className="flex gap-5">
          <Link to="/privacy-policy" className="text-white/40 text-xs hover:text-white/80 transition-colors underline underline-offset-2">
            Privacy Policy
          </Link>
          <Link to="/disclaimer" className="text-white/40 text-xs hover:text-white/80 transition-colors underline underline-offset-2">
            Disclaimer
          </Link>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;
