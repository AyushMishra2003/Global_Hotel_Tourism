// src/pages/ParentCompanyHotels.tsx

import { useState, useEffect } from 'react'
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
import { type Hotel, truncateDescription, slugify, normalizeCityName } from '@/data/hotelData'
import { Building2, MapPin, Search, ArrowLeft, Globe, Star } from 'lucide-react'
import HotelModal from '@/components/HotelModal'
import SEOHead from '@/components/seo/SEOHead'
import { breadcrumbSchema, localBusinessSchema } from '@/components/seo/schemas'

interface LocationState {
  parentCompany: string
  hotels: Hotel[]
}

export default function ParentCompanyHotels() {
  const { parentCompanySlug } = useParams<{ parentCompanySlug: string }>()
  const location = useLocation()
  const state = location.state as LocationState
  const navigate = useNavigate();

  const [parentCompany, setParentCompany] = useState<string>('')
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')
  const [loading, setLoading] = useState(false)
  const [showHotelModal, setShowHotelModal] = useState(false)
  const [modalHotel, setModalHotel] = useState<Hotel | null>(null)

  useEffect(() => {
    if (state?.parentCompany && state?.hotels) {
      setParentCompany(state.parentCompany)
      setHotels(state.hotels)
      setFilteredHotels(state.hotels)
    } else {
      // If no state, we need to fetch the data based on the slug
      // This would require an API endpoint to get hotels by parent company
      setLoading(true)
      // For now, we'll show a fallback
      setParentCompany('Loading...')
    }
  }, [state, parentCompanySlug])

  useEffect(() => {
    let filtered = hotels

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(hotel =>
        (hotel['Hotel Name'] ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hotel.City ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hotel.Description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(hotel => normalizeCityName(hotel.City) === selectedCity)
    }

    setFilteredHotels(filtered)
  }, [hotels, searchTerm, selectedCity])

  const cities = [...new Set(hotels.map(hotel => normalizeCityName(hotel.City)).filter(Boolean))].sort()
  const totalHotels = hotels.length
  const totalCities = cities.length
  // Only show hotels that have a valid Hero Image in this listing
  const displayedHotels = filteredHotels.filter(h => h['Hero Image'] && String(h['Hero Image']).trim())

  const pageUrl = parentCompanySlug ? `https://globalhotelsandtourism.com/parent-company/${parentCompanySlug}` : 'https://globalhotelsandtourism.com/parent-company';
  const breadcrumbLd = parentCompany ? breadcrumbSchema([
    { position: 1, name: 'Home', item: 'https://globalhotelsandtourism.com' },
    { position: 2, name: parentCompany, item: pageUrl }
  ]) : undefined;

  const orgLd = parentCompany ? localBusinessSchema({
    name: parentCompany,
    description: `Properties under the ${parentCompany} brand`,
    url: pageUrl
  }) : undefined;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101c34] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading hotels…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {parentCompany && (
        <SEOHead
          title={`${parentCompany} Properties | Global Hotels & Tourism`}
          description={`Discover properties managed by ${parentCompany}`}
          keywords={`${parentCompany}, hotels, properties`}
          image={'/ght_logo.png'}
          url={pageUrl}
          type="business.business"
          schema={breadcrumbLd}
        />
      )}
      <HotelModal hotel={modalHotel} open={showHotelModal} onClose={() => setShowHotelModal(false)} />
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-[#f0f2f7] border border-[#101c34] text-[#101c34] font-semibold rounded-full px-4 py-2 hover:bg-[#e8ebf3] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#101c34] to-[#2a3f6b] rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">{parentCompany}</h1>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{totalHotels} {totalHotels === 1 ? 'Hotel' : 'Hotels'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{totalCities} {totalCities === 1 ? 'City' : 'Cities'}</span>
              </div>
            </div>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover all properties under the {parentCompany} brand across India
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search hotels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {displayedHotels.length !== totalHotels && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {displayedHotels.length} of {totalHotels} hotels
              </div>
            )}
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="max-w-7xl mx-auto">
          {displayedHotels.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
              <p className="text-gray-600 mb-4">
                No hotels with images match your criteria. Try adjusting your search or filters.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCity('all')
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedHotels.map((hotel, idx) => (
                <div key={idx} className="group cursor-pointer" onClick={() => { setModalHotel(hotel); setShowHotelModal(true); }}>
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white border-gray-200">
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <img
                        src={hotel['Hero Image']}
                        alt={hotel['Hotel Name']}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-white/90 text-gray-700 font-medium">
                          {hotel['Sub-brand'] || 'Premium'}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                          {hotel['Hotel Name']}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{normalizeCityName(hotel.City)}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                          {truncateDescription(hotel.Description, 120)}
                        </p>
                        <div className="flex items-center justify-between">
                          {hotel['Official Website'] && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="text-[#101c34] border-[#101c34] hover:bg-[#f0f2f7]"
                            >
                              <a
                                href={
                                  (hotel['Hotel Name'] && hotel['Hotel Name'].toString().toLowerCase().includes('wedding rose'))
                                    ? 'https://theweddingrose.com/'
                                    : hotel['Official Website']
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <Globe className="w-4 h-4" />
                                Visit Website
                              </a>
                            </Button>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-[#101c34] fill-current" />
                            <span className="text-sm font-medium text-gray-700">Premium</span>
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

        {/* Footer */}
        <div className="text-center mt-12">
          <Link
            to="/all-hotels"
            className="inline-flex items-center text-[#101c34] hover:text-[#101c34] font-medium transition-colors"
          >
            ← Back to All Hotels
          </Link>
        </div>
      </div>
    </div>
  )
}