// src/components/EnhancedSearch.tsx

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, TrendingUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchHotels, type Hotel, slugify } from '@/data/hotelData'
import { fetchVendors, type Vendor } from '@/data/vendorData'
import { useNavigate } from 'react-router-dom'

// Enhanced SearchResult type with more metadata
type SearchResult = 
  | { 
      type: 'Hotel'; 
      label: string; 
      description: string; 
      image: string; 
      link: string; 
      hotel: Hotel;
      city: string;
      rating?: number;
      parentCompany: string;
    }
  | { 
      type: 'Vendor'; 
      label: string; 
      description: string; 
      link: string; 
      vendor: Vendor;
      city: string;
      category: string;
    }
  | { 
      type: 'City'; 
      label: string; 
      description: string; 
      link: string;
      hotelCount?: number;
    }

interface EnhancedSearchProps {
  className?: string
  placeholder?: string
  onSearchResults?: (results: SearchResult[]) => void
  onResultClick?: (result: SearchResult) => void
}

export function EnhancedSearch({ className = '', placeholder, onSearchResults, onResultClick }: EnhancedSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const navigate = useNavigate()
  
  // Data states
  const [allHotels, setAllHotels] = useState<Hotel[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [hotelsData, vendorsData] = await Promise.all([
          fetchHotels(),
          fetchVendors()
        ])
        
        setAllHotels(hotelsData)
        setVendors(vendorsData)
      } catch (error) {
        console.error('Failed to load search data:', error)
      }
    }
    
    loadData()
  }, [])

  // Enhanced search function
  const performSearch = useCallback((term: string): SearchResult[] => {
    if (!term.trim()) return []
    
    const results: SearchResult[] = []
    const lowerTerm = term.toLowerCase()
    
    // Add mock results for testing if no real data is available
    if (allHotels.length === 0 && vendors.length === 0) {
      console.log('Using mock data for search')
      const mockResults: SearchResult[] = [
        {
          type: 'Hotel',
          label: 'Agra Grand Hotel',
          description: 'Agra • Luxury Hotels Group',
          image: '',
          link: '/hotel/agra-grand-hotel',
          hotel: {} as Hotel,
          city: 'Agra',
          parentCompany: 'Luxury Hotels Group',
          rating: 4.5
        },
        {
          type: 'City',
          label: 'Agra',
          description: '25 hotels available',
          link: '/city-hotels/agra',
          hotelCount: 25
        },
        {
          type: 'Vendor',
          label: 'Agra Event Planners',
          description: 'Event Planning • Agra',
          link: '/vendor/agra-event-planners',
          vendor: {} as Vendor,
          city: 'Agra',
          category: 'Event Planning'
        },
        {
          type: 'Hotel',
          label: 'Delhi Palace Hotel',
          description: 'Delhi • Heritage Hotels',
          image: '',
          link: '/hotel/delhi-palace-hotel',
          hotel: {} as Hotel,
          city: 'Delhi',
          parentCompany: 'Heritage Hotels',
          rating: 4.2
        },
        {
          type: 'City',
          label: 'Delhi',
          description: '150 hotels available',
          link: '/city-hotels/delhi',
          hotelCount: 150
        }
      ]
      
      return mockResults.filter(result => 
        result.label.toLowerCase().includes(lowerTerm) ||
        result.description.toLowerCase().includes(lowerTerm) ||
        ('city' in result && result.city?.toLowerCase().includes(lowerTerm))
      )
    }
    
    // Search cities from hotel data
    const citySet = new Map<string, number>();
    allHotels.forEach(hotel => {
      const city = hotel.City?.trim();
      if (city) citySet.set(city, (citySet.get(city) || 0) + 1);
    });
    citySet.forEach((count, cityName) => {
      if (cityName.toLowerCase().includes(lowerTerm)) {
        results.push({
          type: 'City',
          label: cityName,
          description: `${count} hotel${count !== 1 ? 's' : ''} available`,
          link: `/city-hotels/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
          hotelCount: count,
        });
      }
    });

    // Search hotels
    allHotels.forEach(hotel => {
      let matchFound = false
      
      const hotelName = hotel['Hotel Name']?.toLowerCase() || ''
      const description = hotel.Description?.toLowerCase() || ''
      const city = hotel.City?.toLowerCase() || ''
      const parentCompany = hotel['Parent Company']?.toLowerCase() || ''
      
      if (hotelName.includes(lowerTerm) || city.includes(lowerTerm) || 
          parentCompany.includes(lowerTerm) || description.includes(lowerTerm)) {
        matchFound = true
      }
      
      if (matchFound) {
        results.push({
          type: 'Hotel',
          label: hotel['Hotel Name'] || 'Unnamed Hotel',
          description: `${hotel.City} • ${hotel['Parent Company']}`,
          image: hotel['Hero Image'] || '',
          link: `/hotel/${slugify(hotel['Hotel Name'] || '')}`,
          hotel,
          city: hotel.City || '',
          parentCompany: hotel['Parent Company'] || '',
          rating: Math.random() * 2 + 3, // Mock rating
        })
      }
    })

    // Search vendors
    vendors.forEach(vendor => {
      let matchFound = false
      
      const vendorName = vendor.vendorName?.toLowerCase() || ''
      const category = vendor.category?.toLowerCase() || ''
      const city = vendor.city?.toLowerCase() || ''
      
      if (vendorName.includes(lowerTerm) || category.includes(lowerTerm) || city.includes(lowerTerm)) {
        matchFound = true
      }
      
      if (matchFound) {
        results.push({
          type: 'Vendor',
          label: vendor.vendorName || 'Unnamed Vendor',
          description: `${vendor.category || ''} • ${vendor.city || ''}`,
          link: `/vendor/${slugify(vendor.vendorName || '')}`,
          vendor,
          city: vendor.city || '',
          category: vendor.category || ''
        })
      }
    })

    return results.slice(0, 20) // Limit results
  }, [allHotels, vendors])

  // Debounced search effect
  useEffect(() => {
    console.log('Search effect triggered:', { searchTerm, allHotels: allHotels.length, vendors: vendors.length })
    
    if (!searchTerm.trim()) {
      setSearchResults([])
      setFilteredResults([])
      setSearching(false)
      return
    }

    setSearching(true)
    setShowResults(true) // Show results immediately when typing
    
    const timeoutId = setTimeout(() => {
      console.log('Performing search for:', searchTerm)
      const results = performSearch(searchTerm)
      console.log('Search results:', results.length, results)
      
      setSearchResults(results)
      setFilteredResults(results)
      setSearching(false)
      
      if (onSearchResults) {
        onSearchResults(results)
      }
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, performSearch, onSearchResults])

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setShowResults(true)
    }
  }

  // Handle clicking on suggestions
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    inputRef.current?.focus()
  }

  return (
    <div className={`relative w-full max-w-2xl mx-auto z-[999999] ${className}`}>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4">
        <div className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80 w-5 h-5 pointer-events-none" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder || "Search for hotels, venues, and services..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowResults(true)}
              onBlur={() => {
                // Delay hiding to allow clicks on dropdown
                setTimeout(() => {
                  setShowResults(false)
                }, 200)
              }}
              className="w-full pl-10 pr-20 py-3 text-base bg-white/20 backdrop-blur-sm border border-white/30 focus:border-white/50 focus-visible:ring-white/30 rounded-xl text-white placeholder:text-white/70 font-medium transition-all"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
              }}
            />
            
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <Button
            type="submit"
            size="sm"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-lg transition-all duration-300 min-w-[90px] flex items-center justify-center"
            disabled={!searchTerm.trim() || searching}
          >
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      {/* Search Dropdown */}
      {showResults && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Search Results */}
          {searchTerm.trim() ? (
            <div className="max-h-80 overflow-y-auto">
              {searching ? (
                <div className="p-4 text-center">
                  <div className="inline-flex items-center gap-2 text-gray-500">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span>Searching for "{searchTerm}"...</span>
                  </div>
                </div>
              ) : filteredResults.length > 0 ? (
                <div>
                  {filteredResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                      onClick={() => {
                        if (onResultClick) onResultClick(result);
                        else if (result.type === 'City' || result.type === 'Vendor') navigate(result.link);
                        setShowResults(false);
                      }}
                    >
                      {result.type === 'Hotel' && result.image ? (
                        <div className="w-12 h-12 flex-shrink-0">
                          <img
                            src={result.image}
                            alt={result.label}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg'
                            }}
                          />
                        </div>
                      ) : (
                        <Search className="w-4 h-4 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{result.label}</div>
                        <div className="text-sm text-gray-500">{result.description}</div>
                      </div>
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded">{result.type}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <div>No results found for "{searchTerm}"</div>
                  <div className="text-xs mt-1">Try "agra", "delhi", or "hotel"</div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Popular Searches</div>
              {['Agra Hotels', 'Delhi Hotels', 'Wedding Planners', 'Event Management'].map((search, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => {
                    console.log('Popular search clicked:', search)
                    handleSuggestionClick(search)
                  }}
                >
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{search}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EnhancedSearch
