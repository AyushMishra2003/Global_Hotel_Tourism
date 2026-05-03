  import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, Globe, Phone, Mail, Home, ChevronRight } from 'lucide-react'
import breadcrumbBg from '@/assets/breadcums.jpeg'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { fetchHotelsFromApi, transformHotelData } from '@/data/locationData'
import { fetchHotels } from '@/data/hotelData'
import { getImageUrl } from '@/utils/imageUtils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import type { Hotel } from '@/data/hotelData' // Keep for backward compatibility

export default function PremierDestinations() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [showHotelModal, setShowHotelModal] = useState(false)
  const [modalHotel, setModalHotel] = useState<Hotel | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  useEffect(() => {
    async function loadHotels() {
      try {
        setLoading(true)
        // Try primary API; fall back to legacy fetch if needed
        let legacyHotels: any[] = []
        try {
          const { legacyFormatHotels } = await fetchHotelsFromApi()
          legacyHotels = legacyFormatHotels
        } catch {
          legacyHotels = await fetchHotels()
        }

        // Filter hotels from Delhi NCR and Uttarakhand using legacy fields
        const premierHotels = legacyHotels.filter(hotel => {
          const city = (hotel.City ?? '').toLowerCase()
          const state = (hotel.State ?? '').toLowerCase()

          const isDelhiNCR = [
            'new delhi', 'delhi', 'gurgaon', 'gurugram', 'noida', 'faridabad', 'ghaziabad'
          ].some(k => city.includes(k))

          const isUttarakhand = state === 'uttarakhand' || [
            'dehradun', 'haridwar', 'rishikesh', 'nainital', 'mussoorie', 'jim corbett', 'corbett', 'ramnagar'
          ].some(k => city.includes(k))

          return isDelhiNCR || isUttarakhand
        })

        setHotels(premierHotels)
      } catch (error) {
        console.error('Failed to load premier destination hotels:', error)
      } finally {
        setLoading(false)
      }
    }
    loadHotels()
  }, [])
  
  // Clear selectedCity when selectedRegion changes
  useEffect(() => {
    setSelectedCity(null);
  }, [selectedRegion])

  function openHotelModal(hotel: Hotel) {
    setModalHotel(hotel)
    setShowHotelModal(true)
  }

  function closeHotelModal() {
    setShowHotelModal(false)
    setModalHotel(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101c34] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading premier destinations...</p>
        </div>
      </div>
    )
  }

  // Split hotels by region
  const delhiHotels = hotels.filter(hotel => {
    const city = (hotel.City ?? '').toLowerCase();
    const state = (hotel.State ?? '').toLowerCase();
    return [
      'new delhi', 'delhi', 'gurgaon', 'gurugram', 'noida', 'faridabad', 'ghaziabad'
    ].some(k => city.includes(k));
  });
  const uttarakhandHotels = hotels.filter(hotel => {
    const city = (hotel.City ?? '').toLowerCase();
    const state = (hotel.State ?? '').toLowerCase();
    return state === 'uttarakhand' || [
      'dehradun', 'haridwar', 'rishikesh', 'nainital', 'mussoorie', 'jim corbett', 'corbett', 'ramnagar'
    ].some(k => city.includes(k));
  });

  // Group Uttarakhand hotels by city
  const dehradunHotels = uttarakhandHotels.filter(hotel => 
    (hotel.City ?? '').toLowerCase().includes('dehradun')
  );
  
  const mussorieHotels = uttarakhandHotels.filter(hotel => 
    (hotel.City ?? '').toLowerCase().includes('mussoorie')
  );
  
  const jimCorbettHotels = uttarakhandHotels.filter(hotel => 
    (hotel.City ?? '').toLowerCase().includes('jim corbett') || 
    (hotel.City ?? '').toLowerCase().includes('corbett') || 
    (hotel.City ?? '').toLowerCase().includes('ramnagar')
  );
  
  const rishikeshHotels = uttarakhandHotels.filter(hotel => 
    (hotel.City ?? '').toLowerCase().includes('rishikesh')
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Hero Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <img src={breadcrumbBg} alt="Premier Destinations" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101c34]/90 via-[#101c34]/55 to-black/25" />
        <div className="relative h-full flex flex-col justify-end px-6 pb-8 md:px-12 md:pb-10 container mx-auto">
          <nav className="flex items-center gap-1.5 text-white/70 text-sm mb-3">
            <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5" /><span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            {selectedRegion && (
              <>
                <button onClick={() => { setSelectedRegion(null); setSelectedCity(null); }} className="hover:text-white transition-colors capitalize">{selectedRegion}</button>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              </>
            )}
            <span className="text-white font-medium">
              {selectedCity ? selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1) : selectedRegion ? (selectedRegion === 'delhi' ? 'Delhi' : 'Uttarakhand') : 'Premier Destinations'}
            </span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight" style={{ fontFamily: 'var(--font-head)', color: '#ffffff' }}>
            {!selectedRegion && 'Premier Destinations'}
            {selectedRegion === 'delhi' && 'Delhi NCR'}
            {selectedRegion === 'uttarakhand' && !selectedCity && 'Uttarakhand'}
            {selectedCity && selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
          </h1>
          <p className="text-white/70 mt-2 text-sm md:text-base max-w-xl">
            {!selectedRegion && 'Exceptional venues across Delhi NCR and the scenic beauty of Uttarakhand'}
            {selectedRegion === 'delhi' && 'Discover exceptional venues across Delhi NCR'}
            {selectedRegion === 'uttarakhand' && !selectedCity && 'Discover the scenic beauty and venues of Uttarakhand'}
            {selectedCity && `Explore the finest hotels and resorts in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}`}
          </p>
        </div>
      </div>

      {/* Region Selection or Hotels Grid */}
      <div className="container mx-auto px-4 py-8">
        {!selectedRegion ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedRegion('delhi')}>
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img src="/city-images/delhi.jpg" alt="Delhi NCR" className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Premier Destination of Delhi</CardTitle>
                <CardDescription>Exceptional venues in Delhi NCR</CardDescription>
              </CardHeader>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedRegion('uttarakhand')}>
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img src="/city-images/uttarakhand.jpg" alt="Uttarakhand" className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Premier Destination of Uttarakhand</CardTitle>
                <CardDescription>Scenic venues in Uttarakhand</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : selectedRegion === 'uttarakhand' && !selectedCity ? (
          // Uttarakhand City Selection
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedCity('dehradun')}>
              <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                <img 
                  src="/city-images/uttarakhand.jpg" 
                  alt="Dehradun" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Dehradun</CardTitle>
                <CardDescription>{dehradunHotels.length} Hotels</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedCity('mussoorie')}>
              <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                <img 
                  src="/city-images/uttarakhand.jpg" 
                  alt="Mussoorie" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Mussoorie</CardTitle>
                <CardDescription>{mussorieHotels.length} Hotels</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedCity('jimcorbett')}>
              <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                <img 
                  src="/city-images/jim-corbett.jpg" 
                  alt="Jim Corbett" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Jim Corbett</CardTitle>
                <CardDescription>{jimCorbettHotels.length} Hotels</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedCity('rishikesh')}>
              <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-100">
                <img 
                  src="/city-images/uttarakhand.jpg" 
                  alt="Rishikesh" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Rishikesh</CardTitle>
                <CardDescription>{rishikeshHotels.length} Hotels</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Found <span className="font-semibold">
                  {selectedRegion === 'delhi' 
                    ? delhiHotels.length 
                    : selectedCity === 'dehradun'
                      ? dehradunHotels.length
                      : selectedCity === 'mussoorie'
                        ? mussorieHotels.length
                        : selectedCity === 'jimcorbett'
                          ? jimCorbettHotels.length
                          : selectedCity === 'rishikesh'
                            ? rishikeshHotels.length
                            : uttarakhandHotels.length}
                </span> premier hotels in {
                  selectedRegion === 'delhi' 
                    ? 'Delhi NCR' 
                    : selectedCity === 'dehradun'
                      ? 'Dehradun'
                      : selectedCity === 'mussoorie'
                        ? 'Mussoorie'
                        : selectedCity === 'jimcorbett'
                          ? 'Jim Corbett'
                          : selectedCity === 'rishikesh'
                            ? 'Rishikesh'
                            : 'Uttarakhand'
                }
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(
                selectedRegion === 'delhi' 
                  ? delhiHotels 
                  : selectedCity === 'dehradun'
                    ? dehradunHotels
                    : selectedCity === 'mussoorie'
                      ? mussorieHotels
                      : selectedCity === 'jimcorbett'
                        ? jimCorbettHotels
                        : selectedCity === 'rishikesh'
                          ? rishikeshHotels
                          : uttarakhandHotels
              ).map((hotel, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => openHotelModal(hotel)}
                >
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={getImageUrl(hotel['Hero Image'], 'HOTEL')}
                      alt={hotel['Hotel Name']}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== getImageUrl(undefined, 'HOTEL')) {
                          target.src = getImageUrl(undefined, 'HOTEL');
                        }
                      }}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{hotel['Hotel Name']}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hotel.City} • {hotel['Parent Company']}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {hotel.Description || 'Premium hospitality experience awaits you.'}
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829]"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (hotel['Official Website']) {
                          window.open(hotel['Official Website'], '_blank')
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {(selectedRegion === 'delhi' ? delhiHotels.length : uttarakhandHotels.length) === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No hotels found in this region.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hotel Modal */}
      {showHotelModal && modalHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 text-gray-500 hover:text-gray-800"
                onClick={closeHotelModal}
                aria-label="Close"
              >
                ×
              </button>
              <img 
                src={getImageUrl(modalHotel['Hero Image'], 'HOTEL')} 
                alt={modalHotel['Hotel Name']} 
                className="w-full h-64 object-cover rounded-t-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== getImageUrl(undefined, 'HOTEL')) {
                    target.src = getImageUrl(undefined, 'HOTEL');
                  }
                }}
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{modalHotel['Hotel Name']}</h2>
              <p className="text-gray-600 mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {modalHotel.City} • {modalHotel['Parent Company']}
              </p>
              {modalHotel.Description && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{modalHotel.Description}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                {modalHotel['Official Website'] && (
                  <Button 
                    onClick={() => window.open(modalHotel['Official Website'], '_blank')} 
                    className="flex-1 bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829]"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                )}
                <Button variant="outline" onClick={closeHotelModal} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
