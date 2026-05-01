import { Link } from 'react-router-dom';
import SEOHead from '@/components/seo/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { getImageUrl } from '@/utils/imageUtils';

interface CityData {
  name: string;
  slug: string;
  image: string;
  tagline: string;
}

const cities: CityData[] = [
  // North India
  { name: 'Delhi NCR', slug: 'delhi', tagline: 'The heart of India, offering endless possibilities.', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Jaipur', slug: 'jaipur', tagline: 'The Pink City, a vibrant blend of old and new.', image: 'https://images.unsplash.com/photo-1599661046223-e06587154475?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Agra', slug: 'agra', tagline: 'Home to the timeless wonder of the Taj Mahal.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1471&auto=format&fit=crop' },
  { name: 'Udaipur', slug: 'udaipur', tagline: 'The City of Lakes, where romance and royalty meet.', image: 'https://images.unsplash.com/photo-1715405155995-61757307e065?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dWRhaXB1cnxlbnwwfHwwfHx8MA%3D%3D' },
  { name: 'Varanasi', slug: 'varanasi', tagline: 'The spiritual capital of India, on the banks of the Ganges.', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Shimla', slug: 'shimla', tagline: 'The Queen of Hills, a charming colonial retreat.', image: 'https://images.unsplash.com/photo-1593328349242-63c293b85a17?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Manali', slug: 'manali', tagline: 'A paradise for adventurers and nature lovers.', image: 'https://images.unsplash.com/photo-1626621341526-76544dba42b5?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Rishikesh', slug: 'rishikesh', tagline: 'The Yoga Capital of the World, a serene escape.', image: 'https://images.unsplash.com/photo-1599421497821-726a04b73a41?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Amritsar', slug: 'amritsar', tagline: 'Home of the Golden Temple, a city of devotion.', image: 'https://images.unsplash.com/photo-1588282322673-c31965a75c3e?q=80&w=1471&auto=format&fit=crop' },
  { name: 'Lucknow', slug: 'lucknow', tagline: 'The City of Nawabs, known for its culture and cuisine.', image: 'https://images.unsplash.com/photo-1588412803341-e8428516d29a?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Chandigarh', slug: 'chandigarh', tagline: 'A modern city known for its architecture and urban design.', image: 'https://images.unsplash.com/photo-1601752874579-4e4881854df4?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Srinagar', slug: 'srinagar', tagline: 'A jewel in the crown of Kashmir, with stunning lakes.', image: 'https://images.unsplash.com/photo-1595815235553-8a3832138e1a?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Leh Ladakh', slug: 'leh-ladakh', tagline: 'A land of high passes and breathtaking landscapes.', image: 'https://images.unsplash.com/photo-1581793745862-91a4b67979f4?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Mussoorie', slug: 'mussoorie', tagline: 'A picturesque hill station with stunning valley views.', image: 'https://images.unsplash.com/photo-1621189093354-3f804245b1af?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Nainital', slug: 'nainital', tagline: 'A sparkling gem in the Himalayan necklace.', image: 'https://images.unsplash.com/photo-1570692842910-62a5e88355be?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Jodhpur', slug: 'jodhpur', tagline: 'The Blue City, dominated by the Mehrangarh Fort.', image: 'https://images.unsplash.com/photo-1564760290292-23341e4df6ec?q=80&w=1374&auto=format&fit=crop' },
  { name: 'Jaisalmer', slug: 'jaisalmer', tagline: 'The Golden City, rising from the Thar Desert.', image: 'https://images.unsplash.com/photo-1605792579223-43571377d049?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Haridwar', slug: 'haridwar', tagline: 'A holy city where the Ganges enters the plains.', image: 'https://images.unsplash.com/photo-1605649487212-47bdab0624f2?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Dehradun', slug: 'dehradun', tagline: 'A gateway to the Garhwal Himalayas.', image: 'https://images.unsplash.com/photo-1601633967380-9368697c6159?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Dharamshala', slug: 'dharamshala', tagline: 'Home of the Dalai Lama, nestled in the mountains.', image: 'https://images.unsplash.com/photo-1593361688553-833a4a4b1434?q=80&w=1470&auto=format&fit=crop' },

  // West India
  { name: 'Mumbai', slug: 'mumbai', tagline: 'The city of dreams, vibrant and full of life.', image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Goa', slug: 'goa', tagline: 'Sun, sand, and sea - India\'s party capital.', image: 'https://images.unsplash.com/photo-1560179406-1f674e483467?q=80&w=1374&auto=format&fit=crop' },
  { name: 'Pune', slug: 'pune', tagline: 'The Oxford of the East, a hub of culture and education.', image: 'https://images.unsplash.com/photo-1577176648206-5a37123a1e4e?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Ahmedabad', slug: 'ahmedabad', tagline: 'A blend of rich history and modern industry.', image: 'https://images.unsplash.com/photo-1621394517673-a01b58294a40?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Nashik', slug: 'nashik', tagline: 'The wine capital of India, on the banks of Godavari.', image: 'https://images.unsplash.com/photo-1623304393969-a01b58294a40?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Surat', slug: 'surat', tagline: 'The Diamond City, a major commercial hub.', image: 'https://images.unsplash.com/photo-1609639599805-9a34892c9b4c?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Aurangabad', slug: 'aurangabad', tagline: 'A city of gates and home to historic caves.', image: 'https://images.unsplash.com/photo-1604633855195-2093d9a0b634?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Lonavala', slug: 'lonavala', tagline: 'A popular hill station getaway from Mumbai and Pune.', image: 'https://images.unsplash.com/photo-1602343168117-25695e9a7939?q=80&w=1374&auto=format&fit=crop' },
  { name: 'Mahabaleshwar', slug: 'mahabaleshwar', tagline: 'A lush plateau known for its strawberries and viewpoints.', image: 'https://images.unsplash.com/photo-1593361688553-833a4a4b1434?q=80&w=1470&auto=format&fit=crop' },

  // South India
  { name: 'Bengaluru', slug: 'bengaluru', tagline: 'The Garden City and India\'s Silicon Valley.', image: 'https://images.unsplash.com/photo-1593693397640-03a20355d325?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Chennai', slug: 'chennai', tagline: 'A coastal city with a rich cultural heritage.', image: 'https://images.unsplash.com/photo-1616843413587-9e3a35f7bb45?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Hyderabad', slug: 'hyderabad', tagline: 'The City of Pearls, where history meets technology.', image: 'https://images.unsplash.com/photo-1592484785182-658a5c315b13?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Kochi', slug: 'kochi', tagline: 'The Queen of the Arabian Sea, a melting pot of cultures.', image: 'https://images.unsplash.com/photo-1580324200362-3334b78e3a9f?q=80&w=1471&auto=format&fit=crop' },
  { name: 'Mysuru', slug: 'mysuru', tagline: 'The City of Palaces, known for its royal heritage.', image: 'https://images.unsplash.com/photo-1591013482050-85fa4b0dc1f2?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Puducherry', slug: 'puducherry', tagline: 'A charming French colonial town on the coast.', image: 'https://images.unsplash.com/photo-1581289099241-f7a248d55601?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Ooty', slug: 'ooty', tagline: 'A picturesque hill station in the Nilgiri Hills.', image: 'https://images.unsplash.com/photo-1613431186766-59a174a1a458?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Kodaikanal', slug: 'kodaikanal', tagline: 'The Princess of Hill Stations, a misty paradise.', image: 'https://images.unsplash.com/photo-1605283802174-0aedd54a4064?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Coimbatore', slug: 'coimbatore', tagline: 'The Manchester of South India, a major industrial city.', image: 'https://images.unsplash.com/photo-1613431186766-59a174a1a458?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Madurai', slug: 'madurai', tagline: 'The temple city, home to the Meenakshi Amman Temple.', image: 'https://images.unsplash.com/photo-1578499380885-c65a11950ba4?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Visakhapatnam', slug: 'visakhapatnam', tagline: 'The Jewel of the East Coast, a port city with beautiful beaches.', image: 'https://images.unsplash.com/photo-1621939514649-502f547019a3?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Tirupati', slug: 'tirupati', tagline: 'A major pilgrimage city in the hills of Andhra.', image: 'https://images.unsplash.com/photo-1621939514649-502f547019a3?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Alleppey', slug: 'alleppey', tagline: 'The Venice of the East, famous for its backwaters.', image: 'https://images.unsplash.com/photo-1549989476-69a92fa57c36?q=80&w=1470&auto=format&fit=crop' },

  // East India
  { name: 'Kolkata', slug: 'kolkata', tagline: 'The City of Joy, a hub of art and culture.', image: 'https://images.unsplash.com/photo-1595658658481-d53d3f99b825?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Bhubaneswar', slug: 'bhubaneswar', tagline: 'The Temple City of India, with ancient architecture.', image: 'https://images.unsplash.com/photo-1620766165457-a8025baa82e0?q=80&w=1374&auto=format&fit=crop' },
  { name: 'Puri', slug: 'puri', tagline: 'A coastal city famous for its Jagannath Temple and beaches.', image: 'https://images.unsplash.com/photo-1590968233668-38b459b852f3?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Darjeeling', slug: 'darjeeling', tagline: 'Famous for its tea plantations and Himalayan views.', image: 'https://images.unsplash.com/photo-1544634254-3a7a7354347b?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Gangtok', slug: 'gangtok', tagline: 'The capital of Sikkim, a gateway to the Himalayas.', image: 'https://images.unsplash.com/photo-1591130143991-35841490b742?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Guwahati', slug: 'guwahati', tagline: 'The gateway to Northeast India, on the Brahmaputra.', image: 'https://images.unsplash.com/photo-1605283802174-0aedd54a4064?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Shillong', slug: 'shillong', tagline: 'The Scotland of the East, a beautiful hill station.', image: 'https://images.unsplash.com/photo-1609366914992-29405367b6a2?q=80&w=1470&auto=format&fit=crop' },
  { name: 'Patna', slug: 'patna', tagline: 'An ancient city with a rich history on the Ganges.', image: 'https://images.unsplash.com/photo-1605283802174-0aedd54a4064?q=80&w=1470&auto=format&fit=crop' },

  // Central India
  { name: 'Indore', slug: 'indore', tagline: 'The commercial capital of Madhya Pradesh.', image: 'https://images.unsplash.com/photo-1620766165457-a8025baa82e0?q=80&w=1374&auto=format&fit=crop' },
  { name: 'Bhopal', slug: 'bhopal', tagline: 'The City of Lakes, with a rich historical past.', image: 'https://images.unsplash.com/photo-1620766165457-a8025baa82e0?q=80&w=1374&auto=format&fit=crop' },
  { name: 'Gwalior', slug: 'gwalior', tagline: 'Known for its majestic fort and palaces.', image: 'https://images.unsplash.com/photo-1620766165457-a8025baa82e0?q=80&w=1374&auto=format&fit=crop' },
  { name: 'Nagpur', slug: 'nagpur', tagline: 'The Orange City, located in the heart of India.', image: 'https://images.unsplash.com/photo-1620766165457-a8025baa82e0?q=80&w=1374&auto=format&fit=crop' },
  { name: 'Raipur', slug: 'raipur', tagline: 'The capital of Chhattisgarh, a growing industrial hub.', image: 'https://images.unsplash.com/photo-1620766165457-a8025baa82e0?q=80&w=1374&auto=format&fit=crop' }
];

const Hotels = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <SEOHead
        title={`Hotels & Destinations | Global Hotels & Tourism`}
        description={`Explore premier destinations and top hotels across India`}
        keywords={`hotels, destinations, wedding venues, India hotels`}
        image={'/ght_logo.png'}
        url={'https://globalhotelsandtourism.com/hotels'}
      />
      <div className="container mx-auto px-4 py-16">
        {/* Top Destinations Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Premier Destinations</h1>
          <p className="text-lg text-gray-600">Discover premium accommodations across India's most iconic destinations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mb-16">
          {cities.map((city) => (
            <Link
              key={city.name}
              to={`/city/${city.slug}`}
              className="group"
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <img
                    src={getImageUrl(city.image, 'CITY')}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== getImageUrl(undefined, 'CITY')) {
                        target.src = getImageUrl(undefined, 'CITY');
                      }
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <h3 className="text-lg font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
                      {city.name}
                    </h3>
                    <p className="text-sm opacity-90 line-clamp-2">
                      {city.tagline}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hotels;
