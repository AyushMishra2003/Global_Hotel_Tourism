import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';
import breadcrumbBg from '@/assets/breadcums.jpeg';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

// Define vendor categories with their details
const vendorCategories = [
  {
    name: 'Event Planners',
    description: 'Professional wedding and event planning services',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1200&auto=format&fit=crop',
    route: '/vendors/event-planners',
    count: '50+',
  },
  {
    name: 'Caterers',
    description: 'Exquisite catering services for all occasions',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
    route: '/vendors/caterers',
    count: '35+',
  },
  {
    name: 'Photography',
    description: 'Capture your special moments with professional photographers',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200&auto=format&fit=crop',
    route: '/vendors/photography',
    count: '40+',
  },
  {
    name: 'Entertainment',
    description: 'Live music, DJs, and entertainment for your events',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop',
    route: '/vendors/entertainment',
    count: '25+',
  },
  {
    name: 'Destination Venues',
    description: 'Beautiful venues and destination wedding locations',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
    route: '/vendors/destination-venues',
    count: '30+',
  },
  {
    name: 'Production House',
    description: 'Complete event production and technical services',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    route: '/vendors/production-house',
    count: '20+',
  },
  {
    name: 'Fashion Designer',
    description: 'Custom bridal and formal wear designers',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop',
    route: '/vendors/fashion-designer',
    count: '15+',
  },
  {
    name: 'Makeup Artist',
    description: 'Professional makeup and beauty services',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop',
    route: '/vendors/makeup-artist',
    count: '25+',
  },
  {
    name: 'Valet Services',
    description: 'Premium valet and hospitality services',
    image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1200&auto=format&fit=crop',
    route: '/vendors/valet-services',
    count: '10+',
  },
];

export default function AllVendors() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-gray-50">
      {/* Breadcrumb Hero Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <img src={breadcrumbBg} alt="Vendors" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101c34]/90 via-[#101c34]/55 to-black/25" />
        <div className="relative h-full flex flex-col justify-end px-6 pb-8 md:px-12 md:pb-10 container mx-auto">
          <nav className="flex items-center gap-1.5 text-white/70 text-sm mb-3">
            <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5" /><span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-white font-medium">Vendors</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight" style={{ fontFamily: 'var(--font-head)', color: '#ffffff' }}>
            Vendor Categories
          </h1>
          <p className="text-white/70 mt-2 text-sm md:text-base max-w-xl">
            Explore our comprehensive range of wedding and event service providers.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10 md:py-14">

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {vendorCategories.map((category) => (
            <Link key={category.name} to={category.route}>
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full bg-white border border-[#d0d6e8]">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-[#101c34] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {category.count}
                  </div>
                </div>
                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#101c34] transition-colors duration-300 mb-2">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex items-center text-[#101c34] font-semibold text-sm group-hover:text-[#101c34] transition-colors duration-300">
                    Explore {category.name} →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}