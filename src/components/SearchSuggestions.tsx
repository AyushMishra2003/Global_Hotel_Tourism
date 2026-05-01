// src/components/SearchSuggestions.tsx

import { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Mic, 
  MicOff, 
  MapPin, 
  Building2, 
  Users, 
  Calendar,
  Star,
  TrendingUp,
  Clock,
  X
} from 'lucide-react'

interface SearchSuggestion {
  id: string
  text: string
  type: 'hotel' | 'vendor' | 'city' | 'category' | 'recent' | 'trending'
  icon?: React.ReactNode
  count?: number
  badge?: string
}

interface SearchSuggestionsProps {
  query: string
  onSuggestionSelect: (suggestion: string) => void
  onClearRecent?: () => void
  className?: string
}

// Mock data - in a real app, this would come from an API
const mockSuggestions: SearchSuggestion[] = [
  // Hotels
  { id: '1', text: 'The Oberoi Delhi', type: 'hotel', icon: <Building2 className="w-4 h-4" />, badge: '5-star' },
  { id: '2', text: 'Taj Palace Hotel', type: 'hotel', icon: <Building2 className="w-4 h-4" />, badge: 'Luxury' },
  { id: '3', text: 'Hyatt Regency', type: 'hotel', icon: <Building2 className="w-4 h-4" />, badge: '4-star' },
  
  // Vendors
  { id: '4', text: 'Dream Wedding Planners', type: 'vendor', icon: <Users className="w-4 h-4" />, badge: 'Premium' },
  { id: '5', text: 'Royal Caterers', type: 'vendor', icon: <Users className="w-4 h-4" />, badge: 'Popular' },
  
  // Cities
  { id: '6', text: 'Delhi Hotels', type: 'city', icon: <MapPin className="w-4 h-4" />, count: 450 },
  { id: '7', text: 'Agra Venues', type: 'city', icon: <MapPin className="w-4 h-4" />, count: 120 },
  { id: '8', text: 'Goa Resorts', type: 'city', icon: <MapPin className="w-4 h-4" />, count: 89 },
  { id: '9', text: 'Jaipur Heritage Hotels', type: 'city', icon: <MapPin className="w-4 h-4" />, count: 76 },
  
  // Categories
  { id: '10', text: 'Wedding Venues', type: 'category', icon: <Calendar className="w-4 h-4" />, count: 500 },
  { id: '11', text: 'Banquet Halls', type: 'category', icon: <Building2 className="w-4 h-4" />, count: 320 },
  { id: '12', text: 'Destination Wedding', type: 'category', icon: <Star className="w-4 h-4" />, count: 180 },
  { id: '13', text: 'Corporate Events', type: 'category', icon: <Users className="w-4 h-4" />, count: 250 },
]

const trendingSuggestions: SearchSuggestion[] = [
  { id: 't1', text: 'Beach Wedding Resorts', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 't2', text: 'Palace Hotels Rajasthan', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 't3', text: 'Hill Station Venues', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 't4', text: 'Luxury Wedding Planners', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
]

export function SearchSuggestions({ 
  query, 
  onSuggestionSelect, 
  onClearRecent,
  className = '' 
}: SearchSuggestionsProps) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([])
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onSuggestionSelect(transcript)
        setIsListening(false)
      }
      
      recognitionInstance.onerror = () => {
        setIsListening(false)
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
    }
  }, [onSuggestionSelect])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('search-suggestions-recent')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setRecentSearches(parsed.map((text: string, index: number) => ({
          id: `recent-${index}`,
          text,
          type: 'recent' as const,
          icon: <Clock className="w-4 h-4" />
        })))
      } catch (e) {
        console.error('Failed to load recent searches:', e)
      }
    }
  }, [])

  // Filter suggestions based on query
  const filterSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      return []
    }

    const lowerQuery = searchQuery.toLowerCase()
    const filtered = mockSuggestions.filter(suggestion =>
      suggestion.text.toLowerCase().includes(lowerQuery)
    )

    // Sort by relevance (exact matches first, then starts with, then contains)
    filtered.sort((a, b) => {
      const aLower = a.text.toLowerCase()
      const bLower = b.text.toLowerCase()
      
      if (aLower === lowerQuery && bLower !== lowerQuery) return -1
      if (bLower === lowerQuery && aLower !== lowerQuery) return 1
      if (aLower.startsWith(lowerQuery) && !bLower.startsWith(lowerQuery)) return -1
      if (bLower.startsWith(lowerQuery) && !aLower.startsWith(lowerQuery)) return 1
      
      return aLower.localeCompare(bLower)
    })

    return filtered.slice(0, 8) // Limit to 8 suggestions
  }, [])

  // Update filtered suggestions when query changes
  useEffect(() => {
    setFilteredSuggestions(filterSuggestions(query))
  }, [query, filterSuggestions])

  // Save search to recent
  const saveToRecent = useCallback((searchText: string) => {
    if (!searchText.trim()) return

    const updatedRecent = [
      searchText,
      ...recentSearches
        .map(r => r.text)
        .filter(text => text !== searchText)
    ].slice(0, 5)

    localStorage.setItem('search-suggestions-recent', JSON.stringify(updatedRecent))
    
    setRecentSearches(updatedRecent.map((text, index) => ({
      id: `recent-${index}`,
      text,
      type: 'recent' as const,
      icon: <Clock className="w-4 h-4" />
    })))
  }, [recentSearches])

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    saveToRecent(suggestion.text)
    onSuggestionSelect(suggestion.text)
  }

  // Handle voice search
  const toggleVoiceSearch = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    localStorage.removeItem('search-suggestions-recent')
    setRecentSearches([])
    if (onClearRecent) {
      onClearRecent()
    }
  }

  // Get type color
  const getTypeColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'hotel': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'vendor': return 'bg-green-50 text-green-700 border-green-200'
      case 'city': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'category': return 'bg-[#f0f2f7] text-[#101c34] border-[#b8c0d8]'
      case 'recent': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'trending': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-[#f0f2f7] text-[#101c34] border-[#b8c0d8]'
    }
  }

  const showSuggestions = query.trim().length > 0
  const showEmpty = query.trim().length === 0

  return (
    <Card className={`bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl ${className}`}>
      <CardContent className="p-0">
        {/* Voice Search Header */}
        {recognition && (
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {isListening ? 'Listening...' : 'Try voice search'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoiceSearch}
                className={`h-8 w-8 p-0 ${isListening ? 'bg-red-50 hover:bg-red-100 border-red-200' : 'hover:bg-gray-100'}`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-600" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            {isListening && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Speak now...
              </div>
            )}
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          {showSuggestions && (
            <>
              {/* Filtered Suggestions */}
              {filteredSuggestions.length > 0 && (
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Suggestions
                  </h4>
                  <div className="space-y-1">
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                      >
                        <div className="text-gray-500 group-hover:text-gray-700">
                          {suggestion.icon}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-800 group-hover:text-gray-900">
                            {suggestion.text}
                          </span>
                          {suggestion.count && (
                            <span className="text-sm text-gray-500 ml-2">
                              ({suggestion.count} results)
                            </span>
                          )}
                        </div>
                        {suggestion.badge && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getTypeColor(suggestion.type)}`}
                          >
                            {suggestion.badge}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredSuggestions.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No suggestions found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </>
          )}

          {showEmpty && (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search) => (
                      <button
                        key={search.id}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                      >
                        <div className="text-gray-400 group-hover:text-gray-600">
                          {search.icon}
                        </div>
                        <span className="text-gray-600 group-hover:text-gray-800">
                          {search.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {recentSearches.length > 0 && <Separator />}

              {/* Trending Searches */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending Now
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {trendingSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 transition-colors text-left group border border-red-100"
                    >
                      <div className="text-red-500 group-hover:text-red-600">
                        {suggestion.icon}
                      </div>
                      <span className="text-sm text-red-700 group-hover:text-red-800 font-medium">
                        {suggestion.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Quick Categories */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Search</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { text: 'Hotels in Delhi', icon: <Building2 className="w-4 h-4" /> },
                    { text: 'Wedding Venues', icon: <Calendar className="w-4 h-4" /> },
                    { text: 'Event Planners', icon: <Users className="w-4 h-4" /> },
                    { text: 'Banquet Halls', icon: <Building2 className="w-4 h-4" /> },
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => onSuggestionSelect(item.text)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f0f2f7] transition-colors text-left border border-[#d0d6e8]"
                    >
                      <div className="text-[#101c34]">
                        {item.icon}
                      </div>
                      <span className="text-sm text-[#101c34] font-medium">
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SearchSuggestions
