
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { breadcrumbSchema } from '@/components/seo/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { fetchHotels, type Hotel, truncateDescription } from '@/data/hotelData';
import { getImageUrl } from '@/utils/imageUtils';

const cityData = {
  delhi: {
    name: 'Delhi',
    description: 'India\'s capital city offers world-class venues and unparalleled hospitality infrastructure',
    heroImage: './city-images/delhi.jpg',
    highlights: ['5-Star Hotels', 'Grand Banquet Halls', 'Historic Venues', 'Modern Convention Centers'],
    stats: { venues: 250, hotels: 180, caterers: 120 }
  },
  jaipur: {
    name: 'Jaipur',
    description: 'The Pink City combines royal heritage with luxury hospitality for unforgettable events',
    heroImage: './city-images/jaipur.jpg',
    highlights: ['Palace Venues', 'Heritage Hotels', 'Royal Banquets', 'Desert Resorts'],
    stats: { venues: 180, hotels: 120, caterers: 90 }
  },
  udaipur: {
    name: 'Udaipur',
    description: 'City of Lakes offers breathtaking waterfront venues and palatial settings',
    heroImage: './city-images/udaipur.jpg',
    highlights: ['Lake View Venues', 'Palace Hotels', 'Luxury Resorts', 'Royal Settings'],
    stats: { venues: 150, hotels: 100, caterers: 75 }
  },
  agra: {
    name: 'Agra',
    description: 'Home to the Taj Mahal, offering heritage venues with Mughal grandeur',
    heroImage: './city-images/agra.jpg',
    highlights: ['Heritage Hotels', 'Mughal Architecture', 'Garden Venues', 'Cultural Settings'],
    stats: { venues: 120, hotels: 80, caterers: 60 }
  },
  amritsar: {
    name: 'Amritsar',
    description: 'Golden Temple city with warm Punjabi hospitality and vibrant venues',
    heroImage: './city-images/amritsar.jpg',
    highlights: ['Cultural Venues', 'Sikh Heritage', 'Banquet Halls', 'Traditional Settings'],
    stats: { venues: 100, hotels: 70, caterers: 85 }
  },
  lucknow: {
    name: 'Lucknow',
    description: 'City of Nawabs offering elegant venues with refined Awadhi culture',
    heroImage: './city-images/lucknow.jpg',
    highlights: ['Nawabi Architecture', 'Elegant Banquets', 'Cultural Venues', 'Fine Dining'],
    stats: { venues: 110, hotels: 75, caterers: 70 }
  },
  chandigarh: {
    name: 'Chandigarh',
    description: 'Modern planned city with contemporary venues and excellent infrastructure',
    heroImage: './city-images/chandigarh.jpg',
    highlights: ['Modern Architecture', 'Convention Centers', 'Garden Venues', 'Urban Settings'],
    stats: { venues: 90, hotels: 60, caterers: 55 }
  },
  shimla: {
    name: 'Shimla',
    description: 'Hill station charm with scenic venues and colonial heritage settings',
    heroImage: './city-images/shimla.jpg',
    highlights: ['Hill Station Views', 'Colonial Architecture', 'Resort Venues', 'Mountain Settings'],
    stats: { venues: 80, hotels: 95, caterers: 45 }
  },
  dehradun: {
    name: 'Dehradun',
    description: 'Valley of luxury with pristine mountain resorts and scenic venues',
    heroImage: './city-images/dehradun.jpg',
    highlights: ['Mountain Resorts', 'Valley Views', 'Luxury Hotels', 'Natural Settings'],
    stats: { venues: 85, hotels: 110, caterers: 50 }
  },
  varanasi: {
    name: 'Varanasi',
    description: 'Ancient city offering spiritual venues with timeless cultural heritage',
    heroImage: './city-images/varanasi.jpg',
    highlights: ['Heritage Venues', 'Spiritual Settings', 'Ghats Venues', 'Cultural Heritage'],
    stats: { venues: 95, hotels: 65, caterers: 55 },
  },
  goa: {
    name: 'Goa',
    description: 'Coastal charm and vibrant celebrations',
    heroImage: './city-images/goa.jpg',
    highlights: ['Beach Venues', 'Luxury Resorts', 'Party Hotspots', 'Seafood Cuisine'],
    stats: { venues: 200, hotels: 150, caterers: 100 },
  },
  'jim-corbett': {
    name: 'Jim Corbett',
    description: 'Wildlife retreats and serene nature',
    heroImage: './city-images/jim-corbett.jpg',
    highlights: ['Jungle Resorts', 'Riverside Venues', 'Safari Lodges', 'Nature Retreats'],
    stats: { venues: 50, hotels: 40, caterers: 20 },
  },
  uttarakhand: {
    name: 'Uttarakhand',
    description: 'The Land of the Gods, offering serene mountain escapes, spiritual retreats, and adventure activities.',
    heroImage: './city-images/uttarakhand.jpg',
    highlights: ['Mountain Resorts', 'Spiritual Retreats', 'Adventure Activities', 'Scenic Beauty'],
    stats: { venues: 70, hotels: 90, caterers: 40 }
  },
  kerala: {
    name: 'Kerala',
    description: 'God\'s Own Country, famous for its tranquil backwaters, lush landscapes, and beautiful beaches.',
    heroImage: './city-images/kerala.jpg',
    highlights: ['Backwater Venues', 'Beach Resorts', 'Ayurvedic Retreats', 'Houseboats'],
    stats: { venues: 120, hotels: 110, caterers: 80 }
  }
};

const CityPage = () => {
  const { citySlug } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetRange, setBudgetRange] = useState([5000, 100000]);
  const [capacityRange, setCapacityRange] = useState([50, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const city = cityData[citySlug as keyof typeof cityData];

  const pageUrl = citySlug ? `https://globalhotelsandtourism.com/city/${citySlug}` : 'https://globalhotelsandtourism.com/city';
  const breadcrumbLd = city ? breadcrumbSchema([
    { position: 1, name: 'Home', item: 'https://globalhotelsandtourism.com' },
    { position: 2, name: city.name, item: pageUrl }
  ]) : undefined;

  useEffect(() => {
    const loadHotels = async () => {
      if (!city) return;
      try {
        setLoading(true);
        const allHotels = await fetchHotels();
        const cityHotels = allHotels.filter(hotel => 
          hotel.City.toLowerCase().includes(city.name.toLowerCase())
        );
        setHotels(cityHotels);
      } catch (err) {
        setError('Could not load hotels for this city.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, [citySlug, city]);

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">City Not Found</h1>
          <p className="text-gray-600">The city you're looking for doesn't exist in our network yet.</p>
        </div>
      </div>
    );
  }

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = searchTerm === '' ||
      hotel['Hotel Name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hotel.Description && hotel.Description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-blue-50">
      {city && (
        <Helmet>
          <title>{city.name} Venues &amp; Hotels | Global Hotels &amp; Tourism</title>
          <meta name="description" content={city.description} />
          <meta name="keywords" content={`${city.name}, venues, hotels, wedding venues`} />
          <meta property="og:title" content={`${city.name} Venues & Hotels | Global Hotels & Tourism`} />
          <meta property="og:description" content={city.description} />
          <meta property="og:url" content={pageUrl} />
          <link rel="canonical" href={pageUrl} />
          {breadcrumbLd && <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>}
        </Helmet>
      )}
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#b8c0d8]/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#101c34] to-[#2a3f6b] rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Global Hotels & Tourism</h1>
                <p className="text-sm text-gray-600">{city.name} • India</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#101c34]/20 to-blue-500/20"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-[#101c34] mr-2" />
              <Badge className="bg-[#e8ebf3] text-[#101c34] px-4 py-2 text-lg">{city.name}</Badge>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Discover {city.name}'s
              <span className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] bg-clip-text text-transparent"> Premier Venues</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              {city.description}
            </p>

            {/* City Stats */}
            <div className="flex justify-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#101c34]">{city.stats.venues}+</div>
                <div className="text-gray-600">Venues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#101c34]">{city.stats.hotels}+</div>
                <div className="text-gray-600">Hotels</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#101c34]">{city.stats.caterers}+</div>
                <div className="text-gray-600">Caterers</div>
              </div>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {city.highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="bg-white/80 text-gray-700 px-4 py-2">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 bg-white/60">
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search venues, hotels, caterers..."
                  className="pl-10 py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="lg:w-48">
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#101c34]"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="hotel">Hotels</option>
                  <option value="banquet">Banquet Halls</option>
                  <option value="resort">Resorts</option>
                  <option value="destination">Destination Venues</option>
                  <option value="caterer">Caterers</option>
                </select>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:w-auto px-6"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Budget Range (₹)
                    </label>
                    <Slider
                      value={budgetRange}
                      onValueChange={setBudgetRange}
                      max={200000}
                      min={1000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>₹{budgetRange[0].toLocaleString()}</span>
                      <span>₹{budgetRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Guest Capacity
                    </label>
                    <Slider
                      value={capacityRange}
                      onValueChange={setCapacityRange}
                      max={2000}
                      min={25}
                      step={25}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{capacityRange[0]} guests</span>
                      <span>{capacityRange[1]} guests</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vendors Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center text-lg text-gray-600">Loading venues...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-600">{error}</div>
          ) : filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredHotels.map((hotel, idx) => (
                <Card
                  key={idx}
                  className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <img
                      src={getImageUrl(hotel['Hero Image'], 'HOTEL')}
                      alt={hotel['Hotel Name']}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== getImageUrl(undefined, 'HOTEL')) {
                          target.src = getImageUrl(undefined, 'HOTEL');
                        }
                      }}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                        {hotel['Hotel Name']}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {truncateDescription(hotel.Description, 100)}
                      </p>
                    </CardContent>
                    <div className="mt-auto pt-2">
                      {hotel['Official Website'] && (
                        <Button asChild variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800 text-sm">
                          <a
                            href={
                              (hotel['Hotel Name'] && hotel['Hotel Name'].toString().toLowerCase().includes('wedding rose'))
                                ? 'https://theweddingrose.com/'
                                : hotel['Official Website']
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Website →
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center col-span-full py-12">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Venues Found</h3>
              <p className="text-gray-500">No venues matched your search criteria in {city.name}.</p>
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-12">
              Load More Venues
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CityPage;
