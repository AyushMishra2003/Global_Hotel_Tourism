import { Search, ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import image from '../assets/gb2.jpeg';

const cities = [
  "New Delhi", "Gurgaon", "Jaipur", "Goa", "Agra", "Mumbai",
  "Uttarakhand", "Jim Corbett", "Kerala", "Shimla", "Udaipur",
  "Varanasi", "Karnal", "Lonavala",
];

const occasions = [
  "Wedding", "Corporate Event", "Birthday", "Anniversary",
  "Conference", "Social Gathering", "Reception", "Engagement",
  "Baby Shower", "Cocktail Party", "Product Launch", "Seminar",
  "Team Outing", "Gala Dinner",
];

const SecondHeroBanner = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [occasionOpen, setOccasionOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const navigate = useNavigate();
  const cityRef = useRef<HTMLDivElement>(null);
  const occasionRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false);
      if (occasionRef.current && !occasionRef.current.contains(e.target as Node)) setOccasionOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCities = cities.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedOccasion) params.set("occasion", selectedOccasion);

    if (selectedCity) {
      const slug = selectedCity.toLowerCase().replace(/\s+/g, "-");
      navigate(`/city-hotels/${slug}${params.toString() ? `?${params}` : ""}`);
    } else if (selectedOccasion) {
      navigate(`/all-hotels?${params}`);
    } else {
      navigate("/all-hotels");
    }
  };

  const DropdownButton = ({
    value, placeholder, open, onClick, onClear
  }: { value: string; placeholder: string; open: boolean; onClick: () => void; onClear?: () => void }) => (
    <button
      type="button"
      className="flex items-center gap-2 px-4 md:px-6 py-3 bg-white text-gray-800 text-sm w-full justify-between hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>{value || placeholder}</span>
      <span className="flex items-center gap-1">
        {value && onClear && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="text-gray-400 hover:text-gray-600 p-0.5"
          >
            <X className="w-3 h-3" />
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </span>
    </button>
  );

  return (
    <section className="relative h-[300px] sm:h-[380px] md:h-[450px] w-full">
      <img
        src={image}
        alt="India hospitality"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={600}
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 overflow-visible">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8 text-center drop-shadow-lg">
          Find Your Perfect Hotel & Venue
        </h1>

        {/* Desktop Search */}
        <div className="hidden sm:flex items-center">
          <div className="flex rounded-lg shadow-xl relative">
            {/* City Dropdown */}
            <div ref={cityRef} className="relative z-30">
              <div className="min-w-[160px] md:min-w-[190px] border-r border-gray-200">
                <DropdownButton
                  value={selectedCity}
                  placeholder="Select City"
                  open={cityOpen}
                  onClick={() => { setCityOpen(!cityOpen); setOccasionOpen(false); setCitySearch(""); }}
                  onClear={() => setSelectedCity("")}
                />
              </div>
              {cityOpen && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-b shadow-2xl z-[9999] min-w-[190px]">
                  <div className="p-2 border-b border-gray-100">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search city..."
                      value={citySearch}
                      onChange={e => setCitySearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-[#101c34]"
                    />
                  </div>
                  <ul className="max-h-48 overflow-y-auto">
                    {filteredCities.length > 0 ? filteredCities.map((c) => (
                      <li
                        key={c}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#f0f2f7] ${selectedCity === c ? "bg-[#f0f2f7] font-semibold text-[#101c34]" : "text-gray-700"}`}
                        onClick={() => { setSelectedCity(c); setCityOpen(false); setCitySearch(""); }}
                      >
                        {c}
                      </li>
                    )) : (
                      <li className="px-4 py-2 text-sm text-gray-400">No cities found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Occasion Dropdown */}
            <div ref={occasionRef} className="relative border-l border-gray-200 z-20">
              <div className="min-w-[170px] md:min-w-[200px]">
                <DropdownButton
                  value={selectedOccasion}
                  placeholder="Select Occasion"
                  open={occasionOpen}
                  onClick={() => { setOccasionOpen(!occasionOpen); setCityOpen(false); }}
                  onClear={() => setSelectedOccasion("")}
                />
              </div>
              {occasionOpen && (
                <ul className="absolute top-full left-0 bg-white border border-gray-200 rounded-b shadow-2xl z-[9999] min-w-[200px] max-h-52 overflow-y-auto">
                  {occasions.map((o) => (
                    <li
                      key={o}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#f0f2f7] ${selectedOccasion === o ? "bg-[#f0f2f7] font-semibold text-[#101c34]" : "text-gray-700"}`}
                      onClick={() => { setSelectedOccasion(o); setOccasionOpen(false); }}
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className="bg-[#101c34] hover:bg-[#1a2d52] text-white px-5 py-3 transition-colors flex items-center gap-2 font-medium text-sm"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5" />
              <span className="hidden md:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="flex sm:hidden flex-col gap-2 w-full max-w-[320px]">
          {/* City */}
          <div className="relative z-30" ref={cityRef}>
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-white text-gray-800 text-sm rounded-lg shadow-lg"
              onClick={() => { setCityOpen(!cityOpen); setOccasionOpen(false); }}
            >
              <span className={selectedCity ? "text-gray-900 font-medium" : "text-gray-400"}>{selectedCity || "Select City"}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${cityOpen ? "rotate-180" : ""}`} />
            </button>
            {cityOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-2xl z-[9999]">
                <div className="p-2 border-b">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search city..."
                    value={citySearch}
                    onChange={e => setCitySearch(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded outline-none"
                  />
                </div>
                <ul className="max-h-40 overflow-y-auto">
                  {filteredCities.map(c => (
                    <li key={c} className="px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f2f7] cursor-pointer" onClick={() => { setSelectedCity(c); setCityOpen(false); setCitySearch(""); }}>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Occasion */}
          <div className="relative z-20" ref={occasionRef}>
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-white text-gray-800 text-sm rounded-lg shadow-lg"
              onClick={() => { setOccasionOpen(!occasionOpen); setCityOpen(false); }}
            >
              <span className={selectedOccasion ? "text-gray-900 font-medium" : "text-gray-400"}>{selectedOccasion || "Select Occasion"}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${occasionOpen ? "rotate-180" : ""}`} />
            </button>
            {occasionOpen && (
              <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-2xl z-[9999] max-h-44 overflow-y-auto">
                {occasions.map(o => (
                  <li key={o} className="px-4 py-2 text-sm text-gray-700 hover:bg-[#f0f2f7] cursor-pointer" onClick={() => { setSelectedOccasion(o); setOccasionOpen(false); }}>
                    {o}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className="bg-[#101c34] hover:bg-[#1a2d52] text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium shadow-lg transition-colors"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default SecondHeroBanner;
