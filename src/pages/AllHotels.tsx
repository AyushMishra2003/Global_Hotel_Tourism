import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { fetchHotels, type Hotel, slugify, normalizeCityName } from '@/data/hotelData'
import { getImageUrl } from '@/utils/imageUtils'
import { Building2, MapPin, ArrowLeft, Search, X, Home, ChevronRight } from 'lucide-react'
import breadcrumbBg from '@/assets/breadcums.jpeg'
import { Helmet } from 'react-helmet-async'
import HotelModal from '@/components/HotelModal'

interface GroupedHotels {
  [parentCompany: string]: Hotel[]
}

export default function AllHotels() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allHotels, setAllHotels] = useState<Hotel[]>([])
  const [groupedHotels, setGroupedHotels] = useState<GroupedHotels>({})
  const [imageIndexes, setImageIndexes] = useState<{ [k: string]: number }>({})
  const [imageCandidatesMap, setImageCandidatesMap] = useState<{ [k: string]: Hotel[] }>({})
  const intervalRefs = useRef<{ [k: string]: NodeJS.Timeout }>({})
  const [modalHotel, setModalHotel] = useState<Hotel | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Read query params set by top-bar search
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const cityParam = params.get('city') || ''
  const nameParam = params.get('name') || ''
  const occasionParam = params.get('occasion') || ''
  const isSearching = !!(cityParam || nameParam || occasionParam)

  // Flat list for search mode
  const filteredFlat = useMemo(() => {
    if (!isSearching) return []
    return allHotels.filter(hotel => {
      const matchCity = !cityParam || normalizeCityName(hotel.City).toLowerCase() === cityParam.toLowerCase()
      const matchName = !nameParam || (hotel['Hotel Name'] ?? '').toLowerCase().includes(nameParam.toLowerCase())
      const matchOccasion = !occasionParam || (hotel.Description ?? '').toLowerCase().includes(occasionParam.toLowerCase())
      return matchCity && matchName && matchOccasion
    })
  }, [allHotels, cityParam, nameParam, occasionParam, isSearching])

  // Load hotels
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const hotels = await fetchHotels()
        setAllHotels(hotels)
        const grouped = hotels.reduce((acc, hotel) => {
          const pc = hotel['Parent Company'] || 'Independent Hotels'
          if (!acc[pc]) acc[pc] = []
          acc[pc].push(hotel)
          return acc
        }, {} as GroupedHotels)
        setGroupedHotels(grouped)
        const indexes: { [k: string]: number } = {}
        Object.keys(grouped).forEach(pc => { indexes[pc] = 0 })
        setImageIndexes(indexes)
      } catch {
        setError('Cannot load hotels right now — please try again later.')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { Object.values(intervalRefs.current).forEach(clearInterval) }
  }, [])

  // Image rotation for grouped view
  useEffect(() => {
    if (isSearching) return
    const newIntervals: { [k: string]: NodeJS.Timeout } = {}
    const newMap: { [k: string]: Hotel[] } = {}
    Object.entries(groupedHotels).forEach(([pc, hotels]) => {
      const candidates = hotels.filter(h => h['Hero Image']?.trim())
      newMap[pc] = candidates
      if (candidates.length > 1) {
        newIntervals[pc] = setInterval(() => {
          setImageIndexes(prev => ({ ...prev, [pc]: (prev[pc] + 1) % candidates.length }))
        }, 7000)
      }
    })
    setImageCandidatesMap(newMap)
    Object.values(intervalRefs.current).forEach(clearInterval)
    intervalRefs.current = newIntervals
    return () => { Object.values(newIntervals).forEach(clearInterval) }
  }, [groupedHotels, isSearching])

  const removeParam = (key: string) => {
    const next = new URLSearchParams(location.search)
    next.delete(key)
    navigate(`/all-hotels${next.toString() ? `?${next}` : ''}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#b8c0d8]" />
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#101c34] border-t-transparent absolute top-0 left-0" />
          </div>
          <p className="text-xl text-gray-700 font-medium">Loading hotels…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Hotels & Venues | Global Hotels & Tourism</title>
      </Helmet>

      <HotelModal hotel={modalHotel} open={!!modalHotel} onClose={() => setModalHotel(null)} />

      <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-gray-50">

        {/* Breadcrumb Hero Banner */}
        <div className="relative w-full h-64 md:h-80 overflow-hidden">
          <img src={breadcrumbBg} alt="Hotels & Venues" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101c34]/90 via-[#101c34]/55 to-black/25" />
          <div className="relative h-full flex flex-col justify-end px-6 pb-8 md:px-12 md:pb-10 container mx-auto">
            <nav className="flex items-center gap-1.5 text-white/70 text-sm mb-3">
              <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
                <Home className="w-3.5 h-3.5" /><span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              <span className="text-white font-medium">{isSearching ? 'Search Results' : 'Hotels & Venues'}</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight" style={{ fontFamily: 'var(--font-head)', color: '#ffffff' }}>
              {isSearching ? 'Search Results' : 'Hotels & Venues'}
            </h1>
            <p className="text-white/70 mt-2 text-sm md:text-base max-w-xl">
              {isSearching ? 'Showing results for your search' : "Explore India's finest hotels, resorts, and banquet venues."}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">

          {/* Active filter chips */}
          <div className="text-center mb-10">
            <div className="h-1 w-20 bg-gradient-to-r from-[#101c34] to-[#2a3f6b] mx-auto rounded-full mb-5" />

            {/* Active filter chips */}
            {isSearching && (
              <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
                {cityParam && (
                  <span className="flex items-center gap-1 bg-[#101c34] text-white text-sm px-3 py-1 rounded-full">
                    <MapPin className="w-3 h-3" /> {cityParam}
                    <button onClick={() => removeParam('city')}><X className="w-3 h-3 ml-1" /></button>
                  </span>
                )}
                {nameParam && (
                  <span className="flex items-center gap-1 bg-[#101c34] text-white text-sm px-3 py-1 rounded-full">
                    <Search className="w-3 h-3" /> "{nameParam}"
                    <button onClick={() => removeParam('name')}><X className="w-3 h-3 ml-1" /></button>
                  </span>
                )}
                {occasionParam && (
                  <span className="flex items-center gap-1 bg-[#101c34] text-white text-sm px-3 py-1 rounded-full">
                    {occasionParam}
                    <button onClick={() => removeParam('occasion')}><X className="w-3 h-3 ml-1" /></button>
                  </span>
                )}
                <button onClick={() => navigate('/all-hotels')} className="text-sm text-gray-500 underline hover:text-[#101c34]">
                  Clear all
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-md border border-[#d0d6e8]">
                <Building2 className="w-4 h-4 text-[#101c34]" />
                <span className="font-semibold text-gray-800">
                  {isSearching ? filteredFlat.length : Object.values(groupedHotels).reduce((s, h) => s + h.length, 0)}
                </span>
                <span className="text-gray-600">{isSearching ? 'Results' : 'Hotels'}</span>
              </div>
              {!isSearching && (
                <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-md border border-[#d0d6e8]">
                  <Building2 className="w-4 h-4 text-[#101c34]" />
                  <span className="font-semibold text-gray-800">{Object.keys(groupedHotels).length}</span>
                  <span className="text-gray-600">Brands</span>
                </div>
              )}
            </div>
          </div>

          {/* SEARCH MODE — flat individual hotel cards */}
          {isSearching ? (
            filteredFlat.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hotels found</h3>
                <p className="text-gray-500 mb-6">Try a different city or name</p>
                <button
                  onClick={() => navigate('/all-hotels')}
                  className="bg-[#101c34] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a2d52] transition-colors"
                >
                  View All Hotels
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFlat.map((hotel, i) => (
                  <div
                    key={i}
                    className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                    onClick={() => setModalHotel(hotel)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={getImageUrl(hotel['Hero Image'], 'HOTEL')}
                        alt={hotel['Hotel Name']}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = getImageUrl(undefined, 'HOTEL') }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-bold text-sm leading-tight drop-shadow">{hotel['Hotel Name']}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <MapPin className="w-3 h-3 text-[#101c34]" />
                        <span>{normalizeCityName(hotel.City)}</span>
                      </div>
                      <p className="text-xs text-[#101c34] font-medium">{hotel['Parent Company']}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* DEFAULT MODE — grouped by parent company */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(groupedHotels)
                .sort((a, b) => b[1].length - a[1].length)
                .map(([parentCompany, hotels]) => {
                  const hotelCount = hotels.length
                  const hotelCities = [...new Set(hotels.map(h => normalizeCityName(h.City)))].sort()
                  const candidates = imageCandidatesMap[parentCompany] || []
                  const images = candidates.length > 0
                    ? candidates.map(h => getImageUrl(h['Hero Image'], 'HOTEL'))
                    : [getImageUrl(hotels[0]?.['Hero Image'], 'HOTEL')]
                  const currentIdx = imageIndexes[parentCompany] || 0

                  return (
                    <Link
                      key={parentCompany}
                      to={`/parent-company/${slugify(parentCompany)}`}
                      state={{ parentCompany, hotels }}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white border-0 shadow-lg flex flex-col">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {images.map((src, idx) => (
                            <img
                              key={idx}
                              src={src}
                              alt={parentCompany}
                              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 group-hover:scale-110 ${idx === currentIdx % images.length ? 'opacity-100' : 'opacity-0'}`}
                              loading="lazy"
                            />
                          ))}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          {hotelCount >= 5 && (
                            <div className="absolute top-4 left-4 bg-[#101c34] text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Featured
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-white/95 text-[#101c34] px-3 py-1 rounded-full text-xs font-bold border border-[#b8c0d8]">
                            {hotelCount} {hotelCount === 1 ? 'Hotel' : 'Hotels'}
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <CardHeader className="p-0 mb-3">
                            <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-[#101c34] transition-colors">
                              {parentCompany}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0 flex-1">
                            <div className="flex items-start gap-2 text-sm text-gray-500 mb-4">
                              <MapPin className="w-4 h-4 mt-0.5 text-[#101c34] flex-shrink-0" />
                              <span className="line-clamp-2">
                                {hotelCities.length <= 3 ? hotelCities.join(', ') : `${hotelCities.slice(0, 3).join(', ')} +${hotelCities.length - 3} more`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[#101c34] font-medium text-sm mt-auto">
                              <span>View Properties</span>
                              <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
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
      </div>
    </>
  )
}
