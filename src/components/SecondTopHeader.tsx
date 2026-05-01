import { Search, ChevronDown, Menu, X } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const mobileNavItems = [
  { label: "Hotels & Venues", path: "/all-hotels" },
  { label: "Vendors", path: "/vendors" },
  { label: "Event Planners", path: "/vendors/event-planners" },
  { label: "Awards", path: "/awards" },
  { label: "Current Affairs", path: "/current-affairs" },
  { label: "Blogs", path: "/blogs" },
  { label: "About Us", path: "/about" },
];

const cities = [
  "All Cities",
  "New Delhi", "Gurgaon", "Jaipur", "Goa", "Agra", "Mumbai",
  "Uttarakhand", "Jim Corbett", "Kerala", "Shimla", "Udaipur",
  "Varanasi", "Karnal", "Lonavala",
];

const SecondTopHeader = () => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [cityOpen, setCityOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const desktopCityRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close city dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (desktopCityRef.current && !desktopCityRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = useCallback(() => {
    const p = new URLSearchParams();
    if (selectedCity && selectedCity !== "All Cities") p.set("city", selectedCity);
    if (searchText.trim()) p.set("name", searchText.trim());
    navigate(`/all-hotels${p.toString() ? `?${p}` : ""}`);
    setCityOpen(false);
  }, [selectedCity, searchText, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header className="bg-background border-b border-border py-3">
      <div className="container mx-auto flex items-center justify-between px-4">

        {/* Mobile Menu */}
        <div className="flex md:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-2 text-foreground">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetTitle className="p-4 border-b border-border">Menu</SheetTitle>
              <nav className="flex flex-col">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setSheetOpen(false)}
                    className="px-4 py-3 text-[15px] font-medium text-foreground hover:bg-[#f0f2f7] hover:text-[#101c34] border-b border-border"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="p-4">
                  <Link
                    to="/join-as-vendor"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#101c34] text-white rounded px-5 py-2 text-sm font-medium"
                  >
                    Join as Vendor
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/bglogo.png" alt="GHT Logo" className="h-11" />
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-gray-900 tracking-tight">Global Hotels & Tourism</span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center">
          <div className="flex border border-border rounded overflow-visible">

            {/* City Dropdown */}
            <div ref={desktopCityRef} className="relative">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-1.5 bg-background text-foreground text-sm border-r border-border min-w-[130px] justify-between hover:bg-gray-50"
                onClick={() => setCityOpen(v => !v)}
              >
                <span className="truncate">{selectedCity}</span>
                <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${cityOpen ? "rotate-180" : ""}`} />
              </button>
              {cityOpen && (
                <ul className="absolute top-full left-0 bg-white border border-gray-200 rounded shadow-xl z-[9999] min-w-[160px] max-h-52 overflow-y-auto">
                  {cities.map((c) => (
                    <li
                      key={c}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#f0f2f7] ${selectedCity === c ? "bg-[#f0f2f7] font-semibold text-[#101c34]" : "text-gray-700"}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSelectedCity(c);
                        setCityOpen(false);
                      }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Text Input */}
            <input
              type="text"
              placeholder="Search Hotels, Venues, Planners..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-4 py-1.5 text-sm bg-background text-foreground outline-none w-[260px] placeholder:text-muted-foreground"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />

            {/* Clear */}
            {searchText && (
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setSearchText(""); }}
                className="px-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Search Button */}
            <button
              type="button"
              className="bg-[#101c34] hover:bg-[#1a2d52] text-white px-3 py-1.5 transition-colors"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Search Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileSearchOpen(v => !v)}
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Join as Vendor - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/join-as-vendor"
            className="flex items-center gap-2 bg-[linear-gradient(135deg,#101c34_0%,#101c34_60%,#aa8056_100%)] text-white rounded px-5 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Join as Vendor
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-2">
          <div className="flex border border-border rounded overflow-hidden">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 bg-background text-foreground text-xs border-r border-border outline-none"
            >
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="text"
              placeholder="Search Hotels, Venues..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-3 py-2 text-xs bg-background text-foreground outline-none flex-1 placeholder:text-muted-foreground"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <button
              type="button"
              className="bg-[#101c34] text-white px-3 py-2"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default SecondTopHeader;
