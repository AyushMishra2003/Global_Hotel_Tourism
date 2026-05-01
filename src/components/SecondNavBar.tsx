import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Hotels & Venues", path: "/all-hotels", hasDropdown: true },
  { label: "Vendors", path: "/vendors", hasDropdown: true },
  { label: "Event Planners", path: "/vendors/event-planners", hasDropdown: false },
  { label: "Premier Destinations", path: "/premier-destinations-DL-UK", hasDropdown: false },
  { label: "Awards", path: "/awards", hasDropdown: false },
  { label: "Current Affairs", path: "/current-affairs", hasDropdown: false },
  { label: "Blogs", path: "/blogs", hasDropdown: false },
  { label: "About Us", path: "/about", hasDropdown: false },
  // { label: "+91-9810261007", path: "/inquiry", hasDropdown: false },
];

const SecondNavBar = () => {
  return (
    <nav className="hidden md:block bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-between">
          {navItems.map((item) => (
            <li key={item.label} className="flex-shrink-0">
              <Link
                to={item.path}
                className="flex items-center gap-1 px-2 lg:px-3 py-3 text-sm lg:text-[15px] font-medium text-gray-700 hover:text-[#101c34] transition-colors whitespace-nowrap"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default SecondNavBar;
