import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Mail, Home, ChevronRight } from 'lucide-react';
import breadcrumbBg from '@/assets/breadcums.jpeg';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { fetchVendors, type Vendor } from '@/data/vendorData';
import { getVendorProfileUrl } from '@/utils/vendorUtils';

export default function EventPlanners() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventPlanners, setEventPlanners] = useState<Vendor[]>([]);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);


  useEffect(() => {
    async function loadEventPlanners() {
      try {
        setLoading(true);
        const allVendors = await fetchVendors();
        
        // Filter only Event Planners
        const planners = allVendors.filter(vendor => 
          vendor.category && vendor.category.toLowerCase().includes('event planner')
        );
        
        setEventPlanners(planners);
      } catch (err) {
        console.error('Error loading event planners:', err);
        setError('Cannot load event planners right now—please try again later.');
      } finally {
        setLoading(false);
      }
    }
    loadEventPlanners();
  }, []);

  const openVendorModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowVendorModal(true);
  };

  const closeVendorModal = () => {
    setShowVendorModal(false);
    setSelectedVendor(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f2f7] via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl border border-[#d0d6e8] max-w-md">
          <div className="relative h-16 w-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#b8c0d8] border-t-[#101c34] rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-4 border-[#b8c0d8] border-b-[#101c34] rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Loading Event Planners</p>
          <p className="text-gray-600">Fetching our trusted partners…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f2f7] via-white to-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl border border-[#d0d6e8] max-w-md">
          <div className="bg-red-50 p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <span className="text-red-500 text-4xl">×</span>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Error Loading Event Planners</p>
          <p className="text-gray-600 mb-6">We couldn't load the event planner information. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Find 'The Wedding Rose' vendor for featuring
  const weddingRoseVendor = eventPlanners.find(v => v.vendorName.trim().toLowerCase() === 'the wedding rose'.toLowerCase());
  
  // Filter out Wedding Rose from other vendors
  const otherVendors = eventPlanners.filter(vendor => 
    vendor.vendorName.trim().toLowerCase() !== 'the wedding rose'.toLowerCase()
  );
  
  // Separate vendors with and without images
  const vendorsWithImages = otherVendors.filter(vendor => vendor.imageUrl);
  const vendorsWithoutImages = otherVendors.filter(vendor => !vendor.imageUrl);
  
  // Create ordered list: Wedding Rose first, then vendors with images, then vendors without images
  const orderedEventPlanners = weddingRoseVendor 
    ? [weddingRoseVendor, ...vendorsWithImages, ...vendorsWithoutImages]
    : [...vendorsWithImages, ...vendorsWithoutImages];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-gray-50">

      {/* ── Breadcrumb Hero Banner ── */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        {/* Background image */}
        <img
          src={breadcrumbBg}
          alt="Event Planners"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlay — dark at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end px-6 pb-8 md:px-12 md:pb-10 container mx-auto">
          {/* Breadcrumb trail */}
          <nav className="flex items-center gap-1.5 text-white/70 text-sm mb-3">
            <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <Link to="/vendors" className="hover:text-white transition-colors">
              Vendors
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-white font-medium">Event Planners</span>
          </nav>

          {/* Page title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight" style={{ fontFamily: 'var(--font-head)' }}>
            Event Planners
          </h1>
          <p className="text-white/70 mt-2 text-sm md:text-base max-w-xl">
            Discover our curated selection of professional event planners and wedding specialists
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-14">



        {/* All Event Planners Grid */}
        <section className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-[#101c34] mb-6 text-center">
            All Event Planners ({orderedEventPlanners.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {orderedEventPlanners.map((vendor, idx) => {
              const isWeddingRose = vendor.vendorName.trim().toLowerCase() === 'the wedding rose'.toLowerCase();
              
              return (
                <Card
                  key={vendor.vendorName + vendor.email + idx}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col bg-white group ${
                    !vendor.featured ? 'cursor-pointer' : ''
                  } ${
                    isWeddingRose || vendor.featured
                      ? 'border-4 border-[#101c34] shadow-lg ring-2 ring-[#b8c0d8]' 
                      : 'border border-[#d0d6e8]'
                  }`}
                  onClick={() => !vendor.featured && openVendorModal(vendor)}
                >
                  {(isWeddingRose || vendor.featured) && (
                    <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-[#101c34] to-[#2a3f6b] text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                      Featured
                    </div>
                  )}
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <img
                      src={vendor.imageUrl || '/public/placeholder.svg'}
                      alt={vendor.vendorName}
                      className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                        isWeddingRose 
                          ? 'object-contain p-4 bg-white' 
                          : 'object-cover'
                      }`}
                      loading="lazy"
                    />
                    {!isWeddingRose && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                    )}
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className={`text-lg font-bold transition-colors duration-300 ${
                      isWeddingRose 
                        ? 'text-[#101c34]' 
                        : 'text-gray-900 group-hover:text-[#101c34]'
                    }`}>
                      {vendor.vendorName}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {vendor.city}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        <strong>Contact:</strong> {vendor.contactPersonName}
                      </p>
                      <p>
                        <strong>Email:</strong> {vendor.email}
                      </p>
                      {/* Phone removed as requested */}
                    </div>
                    {!isWeddingRose && (
                      <div className="mt-auto pt-4 space-y-2">
                        {vendor.featured && (
                          <Link to={getVendorProfileUrl(vendor.vendorName, vendor.id)}>
                            <Button className="w-full bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] text-white text-sm">
                              View Profile
                            </Button>
                          </Link>
                        )}
                        {!vendor.featured && (
                          <div className="text-[#101c34] font-semibold text-sm hover:text-[#101c34] transition-colors">
                            Click for more details →
                          </div>
                        )}
                        {vendor.websiteUrl && (
                          <Button asChild variant="link" className="p-0 h-auto text-[#101c34] hover:text-[#101c34] text-sm font-semibold">
                            <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer">
                              Visit Website →
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                    {isWeddingRose && (
                      <div className="mt-auto pt-4 space-y-2">
                        {vendor.featured && (
                          <Link to={getVendorProfileUrl(vendor.vendorName, vendor.id)}>
                            <Button className="w-full bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] text-white text-sm">
                              View Profile
                            </Button>
                          </Link>
                        )}
                        {vendor.websiteUrl && (
                          <Button asChild variant="link" className="p-0 h-auto text-[#101c34] hover:text-[#101c34] text-sm font-semibold">
                            <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer">
                              Visit Website →
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="text-center mt-12">
          <Link to="/vendors" className="inline-flex items-center bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] text-white font-medium px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            ← Back to All Categories
          </Link>
        </div>

        {/* Vendor Details Modal */}
        <Dialog open={showVendorModal} onOpenChange={closeVendorModal}>
          <DialogContent className="sm:max-w-[90vw] md:max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedVendor && (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedVendor.imageUrl || '/placeholder.svg'} 
                      alt={selectedVendor.vendorName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#b8c0d8]"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedVendor.vendorName}</h3>
                      <p className="text-gray-600 font-medium">{selectedVendor.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-[#101c34] text-[#101c34]" />
                    <span className="font-semibold">5.0</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3">About</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedVendor.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-[#101c34]" />
                        <span className="text-gray-700">{selectedVendor.city}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-[#101c34]" />
                        <span className="text-gray-700">{selectedVendor.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-[#101c34]" />
                        <span className="text-gray-700">{selectedVendor.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedVendor.websiteUrl && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Website</h4>
                    <a 
                      href={selectedVendor.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#101c34] hover:text-[#101c34] underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                <div className="flex justify-center pt-4">
                  <button
                    onClick={closeVendorModal}
                    className="bg-gradient-to-r from-[#f0f2f7]0 to-red-500 hover:bg-[#0d1829] text-white font-medium px-8 py-3 rounded-full transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
