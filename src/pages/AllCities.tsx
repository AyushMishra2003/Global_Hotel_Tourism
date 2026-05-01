// src/pages/AllCities.tsx

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fetchHotels, type Hotel, slugify, normalizeCityName } from '@/data/hotelData'
import { getImageUrl } from '@/utils/imageUtils'
import { MapPin, Building2, Search, ArrowLeft } from 'lucide-react'

const cityImageMap: Record<string, string> = {
  "Agra": "./city-images/agra.jpg",
  "New Delhi": "./city-images/delhi.jpg",
  "Goa": "./city-images/goa.jpg",
  "Jaipur": "./city-images/jaipur.jpg",
  "Jim Corbett": "./city-images/jim-corbett.jpg",
  "Kerela": "./city-images/kerela.jpg",
  "Uttarakhand": "./city-images/uttarakhand.jpg",
  "Gurgaon": "./city-images/gurgaon.jpg",
  "Karnal": "./city-images/karnal.jpg",
  "Lonavala": "./city-images/lonavala.jpg",
  "Mumbai": "./city-images/mumbai.webp",
  "Udaipur": "./city-images/udaipur.jpeg",
};

interface GroupedHotels {
  [city: string]: Hotel[]
}

export default function AllCities() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [groupedHotels, setGroupedHotels] = useState<GroupedHotels>({})
  const [filteredHotels, setFilteredHotels] = useState<GroupedHotels>({})
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const hotels = await fetchHotels()
        
        // Group hotels by city (normalized)
        const grouped = hotels.reduce((acc, hotel) => {
          const normalizedCity = normalizeCityName(hotel.City || 'Unknown City')
          if (!acc[normalizedCity]) {
            acc[normalizedCity] = []
          }
          acc[normalizedCity].push(hotel)
          return acc
        }, {} as GroupedHotels)
        
        setGroupedHotels(grouped)
        setFilteredHotels(grouped)
      } catch (err) {
        console.error('Error loading hotels:', err)
        setError('Cannot load cities right now—please try again later.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Search functionality
  useEffect(() => {
    if (!searchTerm) {
      setFilteredHotels(groupedHotels)
      return
    }

    const filtered: GroupedHotels = {}
    Object.entries(groupedHotels).forEach(([city, hotels]) => {
      if (city.toLowerCase().includes(searchTerm.toLowerCase())) {
        filtered[city] = hotels
      }
    })
    
    setFilteredHotels(filtered)
  }, [searchTerm, groupedHotels])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f2f7] via-white to-gray-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#b8c0d8]"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#101c34] border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="text-xl text-gray-700 font-medium">Loading cities…</p>
          <p className="text-sm text-gray-500 mt-2">Discovering amazing destinations for you</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f2f7] via-white to-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
            <MapPin className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-lg text-red-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const cities = Object.keys(filteredHotels).sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-gray-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(251, 191, 36, 0.2) 0%, transparent 50%)',
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        {/* Enhanced Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 bg-[#f0f2f7] border border-[#101c34] text-[#101c34] font-semibold rounded-full px-4 py-2 hover:bg-[#e8ebf3] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" /> 
          <span>Go Back</span>
        </button>

        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#101c34] to-[#2a3f6b] bg-clip-text text-transparent mb-4 tracking-tight">
              All Cities
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-[#101c34] to-[#2a3f6b] mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore our complete collection of destinations across India
          </p>
          
          {/* Enhanced Stats Section */}
          <div className="flex items-center justify-center gap-8 text-sm mb-12">
            <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md border border-[#d0d6e8]">
              <MapPin className="w-5 h-5 text-[#101c34]" />
              <span className="font-semibold text-gray-800">{cities.length}</span>
              <span className="text-gray-600">Cities</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md border border-[#d0d6e8]">
              <Building2 className="w-5 h-5 text-[#101c34]" />
              <span className="font-semibold text-gray-800">{Object.values(filteredHotels).reduce((sum, hotels) => sum + hotels.length, 0)}</span>
              <span className="text-gray-600">Hotels</span>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 text-lg border border-[#b8c0d8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#101c34] focus:border-transparent shadow-lg bg-white/95 backdrop-blur-sm"
              />
            </div>
            {searchTerm && (
              <p className="text-center text-gray-600 mt-4">
                {cities.length === 0 
                  ? "No results found. Try a different search term."
                  : `Found ${cities.length} cities with ${Object.values(filteredHotels).reduce((sum, hotels) => sum + hotels.length, 0)} hotels`
                }
              </p>
            )}
          </div>
        </div>

        {/* Enhanced Grid Layout */}
        <div className="max-w-7xl mx-auto">
          {cities.length === 0 && searchTerm ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#e8ebf3] to-[#e8ebf3] rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-[#101c34]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-6">We couldn't find any cities matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cities.map((city) => {
                const hotels = filteredHotels[city]
                const hotelCount = hotels.length
                const parentCompanies = [...new Set(hotels.map(hotel => hotel['Parent Company']))].filter(Boolean).sort()
                
                return (
                  <Link
                    key={city}
                    to={`/city-hotels/${slugify(city)}`}
                    state={{ city, hotels }}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 bg-white/90 backdrop-blur-sm border-0 shadow-lg group-hover:shadow-[#101c34]/20 flex flex-col relative">
                      {/* Enhanced Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={getImageUrl(cityImageMap[city], 'CITY')}
                          alt={city}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== getImageUrl(undefined, 'CITY')) {
                              target.src = getImageUrl(undefined, 'CITY');
                            }
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                        
                        {/* Popular Badge */}
                        {hotelCount >= 10 && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-[#101c34] to-[#2a3f6b] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                            Popular
                          </div>
                        )}
                        
                        {/* Hotel Count Badge */}
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#101c34] px-3 py-1 rounded-full text-sm font-bold shadow-lg border border-[#b8c0d8]">
                          {hotelCount} {hotelCount === 1 ? 'Hotel' : 'Hotels'}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex-1 flex flex-col relative">
                        <CardHeader className="p-0 mb-4">
                          <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-[#101c34] transition-colors duration-300 mb-2">
                            {city}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="p-0 flex-1">
                          <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                              <Building2 className="w-4 h-4 mt-0.5 text-[#101c34] flex-shrink-0" />
                              <span className="line-clamp-2 leading-relaxed">
                                {parentCompanies.length > 0 
                                  ? `${parentCompanies.length} ${parentCompanies.length === 1 ? 'Brand' : 'Brands'}`
                                  : 'Independent Hotels'
                                }
                              </span>
                            </div>
                          </div>
                          
                          {/* Explore City Button */}
                          <div className="mt-auto">
                            <div className="flex items-center justify-between text-[#101c34] group-hover:text-[#101c34] font-medium transition-colors duration-300">
                              <span>Explore City</span>
                              <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
        
        {/* Enhanced Footer Link */}
        <div className="text-center mt-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}