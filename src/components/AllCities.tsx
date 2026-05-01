import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PLACEHOLDER_IMAGES, getImageUrl } from '@/utils/imageUtils'

// Type definitions based on our database schema
interface Location {
  id: number;
  city: string;
  state: string | null;
  country: string;
  image_url: string | null;
  description: string | null;
  hotel_count: number;
}

export default function AllCities() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        setLoading(true);
        const response = await fetch('/api/locations');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setLocations(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError('Failed to load locations. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchLocations();
  }, []);

  function getLocationUrl(location: Location): string {
    // Create a URL-friendly version of the city name
    const citySlug = location.city.toLowerCase().replace(/\s+/g, '-');
    return `/destinations/${citySlug}`;
  }
  
  // Use the utility function from imageUtils.ts for consistency
  function getLocationImage(location: Location): string {
    return getImageUrl(location.image_url, 'CITY');
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101c34] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <p className="text-red-700 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        Popular Destinations
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {locations.map((location) => (
          <Card 
            key={location.id} 
            className="overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <Link to={getLocationUrl(location)} className="block">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={getLocationImage(location)}
                  alt={`${location.city}, ${location.state || location.country}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== getImageUrl(undefined, 'CITY')) {
                      target.src = getImageUrl(undefined, 'CITY');
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl font-bold">{location.city}</h3>
                  <p className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {location.state || location.country}
                  </p>
                </div>
              </div>
            </Link>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {location.hotel_count} {location.hotel_count === 1 ? 'Hotel' : 'Hotels'}
                </p>
                <Link to={getLocationUrl(location)} className="flex items-center text-[#101c34] hover:text-[#101c34] text-sm font-medium">
                  Explore
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-10">
        <Link to="/all-destinations">
          <Button variant="outline" className="border-[#101c34] text-[#101c34] hover:bg-[#f0f2f7]">
            View All Destinations
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
