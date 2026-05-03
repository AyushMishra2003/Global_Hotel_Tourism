// src/pages/CityHotels.tsx

import { useState, useEffect, useMemo } from 'react'
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchHotels, type Hotel, truncateDescription, slugify, normalizeCityName } from '@/data/hotelData'
import { getImageUrl } from '@/utils/imageUtils'
import { MapPin, Building2, Search, ArrowLeft, Globe, Star, Home, ChevronRight } from 'lucide-react'
import HotelModal from '@/components/HotelModal'
import breadcrumbBg from '@/assets/breadcums.jpeg'
import { Helmet } from 'react-helmet-async'
import { breadcrumbSchema } from '@/components/seo/schemas'

interface LocationState {
  city: string
  hotels: Hotel[]
}

export default function CityHotels() {
  const { citySlug } = useParams<{ citySlug: string }>()
  const location = useLocation()
  const state = location.state as LocationState | undefined
  const navigate = useNavigate();
  
  // Mapping for international destination slugs to actual country names
  // (Moved inside useEffect to avoid dependency warning)

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const occasionFilter = searchParams.get('occasion') || ''

  const [city, setCity] = useState<string>('')
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParentCompany, setSelectedParentCompany] = useState('all')
  const [loading, setLoading] = useState(false)
  const [showHotelModal, setShowHotelModal] = useState(false)
  const [modalHotel, setModalHotel] = useState<Hotel | null>(null)

  useEffect(() => {
    const internationalDestinationMapping: { [key: string]: string } = {
      'uae': 'United Arab Emirates',
      'sri-lanka': 'Sri Lanka',
      'malaysia': 'Malaysia',
      'thailand': 'Thailand',
      'vietnam': 'Vietnam',
      'maldives': 'Maldives',
      'oman': 'Oman',
      'turkey': 'Turkey'
    };
    async function loadHotels() {
      setLoading(true)
      if (state?.city && state?.hotels) {
        setCity(state.city)
        setHotels(state.hotels)
        setFilteredHotels(state.hotels)
        setLoading(false)
      } else {
        // Fallback: fetch all hotels and filter by citySlug or countrySlug
        try {
          const allHotels = await fetchHotels();
          let cityHotels: Hotel[] = [];
          if (citySlug === 'uttarakhand') {
            cityHotels = allHotels.filter(h => h.State && h.State.toLowerCase() === 'uttarakhand');
            setCity('Uttarakhand');
          } else if (citySlug === 'jim-corbett') {
            cityHotels = allHotels.filter(h => h.City && h.City.toLowerCase() === 'jim corbett');
            setCity('Jim Corbett');
          } else {
            // Try to match by city first
            const cityName = allHotels
              .map(h => normalizeCityName(h.City))
              .find(name => slugify(name) === citySlug);
            if (cityName) {
              cityHotels = allHotels.filter(h => slugify(normalizeCityName(h.City)) === citySlug);
              setCity(cityName);
            } else {
              // Try to match by country for international destinations
              const mappedCountryName = internationalDestinationMapping[citySlug];
              if (mappedCountryName) {
                cityHotels = allHotels.filter(h => h.country && h.country.trim() === mappedCountryName);
                setCity(mappedCountryName);
              } else {
                // Fallback: try to match by normalized country name
                const countryName = allHotels
                  .map(h => h.country ? h.country.trim().toLowerCase().replace(/\s+/g, '-') : '')
                  .find(name => name && name === citySlug);
                if (countryName) {
                  cityHotels = allHotels.filter(h => {
                    const normalizedCountry = h.country ? h.country.trim().toLowerCase().replace(/\s+/g, '-') : '';
                    return normalizedCountry === citySlug;
                  });
                  // Set city to display the original country name
                  const originalCountry = allHotels.find(h => h.country && h.country.trim().toLowerCase().replace(/\s+/g, '-') === citySlug)?.country || '';
                  setCity(originalCountry);
                } else {
                  setCity('');
                  setHotels([]);
                  setFilteredHotels([]);
                  setLoading(false);
                  return;
                }
              }
            }
          }
          setHotels(cityHotels);
          setFilteredHotels(cityHotels);
        } catch (err) {
          setCity('');
          setHotels([]);
          setFilteredHotels([]);
        } finally {
          setLoading(false);
        }
      }
    }
    loadHotels();
  }, [state, citySlug]);

  const pageUrl = city ? `https://globalhotelsandtourism.com/city-hotels/${citySlug}` : 'https://globalhotelsandtourism.com/city-hotels';
  const breadcrumbLd = city ? breadcrumbSchema([
    { position: 1, name: 'Home', item: 'https://globalhotelsandtourism.com' },
    { position: 2, name: city, item: pageUrl }
  ]) : undefined;

  useEffect(() => {
    let filtered = hotels

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(hotel =>
        (hotel['Hotel Name'] ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hotel['Parent Company'] ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hotel.Description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by parent company
    if (selectedParentCompany !== 'all') {
      filtered = filtered.filter(hotel => hotel['Parent Company'] === selectedParentCompany)
    }

    // Filter by occasion (from URL query param)
    if (occasionFilter) {
      filtered = filtered.filter(hotel =>
        (hotel.Description ?? '').toLowerCase().includes(occasionFilter.toLowerCase()) ||
        (hotel['Hotel Name'] ?? '').toLowerCase().includes(occasionFilter.toLowerCase())
      )
    }

    setFilteredHotels(filtered)
  }, [hotels, searchTerm, selectedParentCompany, occasionFilter])

  const parentCompanies = [...new Set(hotels.map(hotel => hotel['Parent Company']))].filter(Boolean).sort()
  const totalHotels = hotels.length
  const totalParentCompanies = parentCompanies.length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f2f7] via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl border border-[#d0d6e8] max-w-md">
          <div className="relative h-16 w-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#b8c0d8] border-t-[#101c34] rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-[#b8c0d8] border-b-[#101c34] rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Loading Hotels</p>
          <p className="text-gray-600">Discovering premium accommodations in {city}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-gray-50">
      {city && (
        <Helmet>
          <title>{city} Hotels &amp; Venues | Global Hotels &amp; Tourism</title>
          <meta name="description" content={`Discover curated hotels and venues in ${city}`} />
          <meta name="keywords" content={`${city}, hotels, venues, wedding venues`} />
          <meta property="og:title" content={`${city} Hotels & Venues | Global Hotels & Tourism`} />
          <meta property="og:description" content={`Discover curated hotels and venues in ${city}`} />
          <meta property="og:url" content={pageUrl} />
          <link rel="canonical" href={pageUrl} />
          {breadcrumbLd && <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>}
        </Helmet>
      )}
      <HotelModal hotel={modalHotel} open={showHotelModal} onClose={() => setShowHotelModal(false)} />

      {/* Breadcrumb Hero Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <img src={breadcrumbBg} alt={city} className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101c34]/90 via-[#101c34]/55 to-black/25" />
        <div className="relative h-full flex flex-col justify-end px-6 pb-8 md:px-12 md:pb-10 container mx-auto">
          <nav className="flex items-center gap-1.5 text-white/70 text-sm mb-3">
            <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5" /><span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <Link to="/allcities" className="hover:text-white transition-colors">Cities</Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-white font-medium">{city}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight" style={{ fontFamily: 'var(--font-head)', color: '#ffffff' }}>
            {city}
          </h1>
          <p className="text-white/70 mt-2 text-sm md:text-base max-w-xl">
            Discover our curated selection of premium accommodations in {city}
            {occasionFilter && <span className="block text-white/60 mt-0.5">Filtered for: {occasionFilter}</span>}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">

        {/* Stats */}
        <div className="text-center mb-10">
          <div className="h-1 w-20 bg-gradient-to-r from-[#101c34] to-[#2a3f6b] mx-auto rounded-full mb-5" />
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-md border border-[#d0d6e8]">
              <Building2 className="w-4 h-4 text-[#101c34]" />
              <span className="font-semibold text-gray-800">{totalHotels}</span>
              <span className="text-gray-600">{totalHotels === 1 ? 'Hotel' : 'Hotels'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-md border border-[#d0d6e8]">
              <Building2 className="w-4 h-4 text-[#101c34]" />
              <span className="font-semibold text-gray-800">{totalParentCompanies}</span>
              <span className="text-gray-600">{totalParentCompanies === 1 ? 'Brand' : 'Brands'}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-md border border-[#d0d6e8] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#101c34] w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search hotels by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#b8c0d8] focus-visible:ring-[#101c34]"
                />
              </div>
              <Select value={selectedParentCompany} onValueChange={setSelectedParentCompany}>
                <SelectTrigger className="border-[#b8c0d8] focus:ring-[#101c34]">
                  <SelectValue placeholder="Filter by brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {parentCompanies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {filteredHotels.length !== totalHotels && (
              <div className="mt-4 text-sm flex items-center justify-between">
                <div className="text-[#101c34] font-medium">
                  Showing <span className="font-bold">{filteredHotels.length}</span> of {totalHotels} hotels
                </div>
                {(searchTerm || selectedParentCompany !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#101c34] hover:text-[#101c34] hover:bg-[#f0f2f7]"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedParentCompany('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="max-w-7xl mx-auto">
          {filteredHotels.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[#d0d6e8] max-w-2xl mx-auto">
              <div className="bg-[#f0f2f7] p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-[#101c34]" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No hotels found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any hotels matching your criteria. Try adjusting your search or filters.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedParentCompany('all')
                }}
                className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.map((hotel, idx) => (
                <div key={idx} className="group cursor-pointer" onClick={() => { setModalHotel(hotel); setShowHotelModal(true); }}>
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white border-gray-200 group-hover:border-[#101c34] h-full flex flex-col">
                    {/* Hotel Image with Gradient Overlay */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <img
                        src={getImageUrl(hotel['Hero Image'], 'HOTEL')}
                        alt={hotel['Hotel Name']}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== getImageUrl(undefined, 'HOTEL')) {
                            target.src = getImageUrl(undefined, 'HOTEL');
                          }
                        }}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                      
                      {/* Star Rating Badge */}
                      {hotel['Star Rating'] && (
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#101c34] px-3 py-1 rounded-full text-sm font-bold shadow-lg border border-[#b8c0d8] flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#101c34] text-[#101c34]" />
                          <span>{parseFloat(hotel['Star Rating']).toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col">
                      <CardHeader className="p-0 mb-4">
                        <div className="flex flex-col items-start mb-2">
                          {/* Company Badge */}
                          {hotel['Parent Company'] && (
                            <div className="mb-2">
                              <Badge variant="secondary" className="bg-gradient-to-r from-[#f0f2f7] to-[#f0f2f7] text-[#101c34] font-medium border border-[#b8c0d8]">
                                {hotel['Parent Company']}
                              </Badge>
                            </div>
                          )}
                          
                          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#101c34] transition-colors duration-300 mb-2">
                            {hotel['Hotel Name']}
                          </CardTitle>
                          
                          <CardDescription className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-[#101c34] flex-shrink-0" />
                            <span className="leading-relaxed">{normalizeCityName(hotel.City)}</span>
                          </CardDescription>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-0 flex-1">
                        <p className="text-gray-700 text-sm mb-6 line-clamp-3">
                          {truncateDescription(hotel.Description, 120)}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          {hotel['Official Website'] && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="text-[#101c34] border-[#b8c0d8] hover:bg-[#f0f2f7] hover:text-[#101c34]"
                            >
                              <a
                                href={
                                  (hotel['Hotel Name'] && hotel['Hotel Name'].toString().toLowerCase().includes('wedding rose'))
                                    ? 'https://theweddingrose.com/'
                                    : hotel['Official Website']
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2"
                              >
                                <Globe className="w-4 h-4" />
                                Visit Website
                              </a>
                            </Button>
                          )}
                          <div className="flex items-center gap-1 text-[#101c34]">
                            <span className="text-sm font-medium">View Details</span>
                            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-16">
          <Link
            to="/allcities"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to All Cities</span>
          </Link>
        </div>
      </div>
    </div>
  )
}