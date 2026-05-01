import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Vendor, fetchVendorProfile } from '../data/vendorData';
import { extractVendorIdFromSlug } from '../utils/vendorUtils';
import { Helmet } from 'react-helmet-async';

export default function VendorProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [showContactForm, setShowContactForm] = useState(false);

    useEffect(() => {
        const loadVendor = async () => {
            if (!id) {
                setError('Invalid vendor ID');
                setLoading(false);
                return;
            }

            // Try to extract ID from slug, if it fails, treat as direct ID
            let vendorId: number;
            const extractedId = extractVendorIdFromSlug(id);
            if (extractedId) {
                vendorId = extractedId;
            } else {
                // Fallback to treating the parameter as a direct ID
                const parsedId = parseInt(id);
                if (isNaN(parsedId)) {
                    setError('Invalid vendor ID');
                    setLoading(false);
                    return;
                }
                vendorId = parsedId;
            }

            try {
                const vendorData = await fetchVendorProfile(vendorId);
                if (!vendorData) {
                    setError('Vendor not found');
                    setLoading(false);
                    return;
                }
                setVendor(vendorData);
                setSelectedImage(vendorData.imageUrl || vendorData.galleryImages?.[0] || '');
            } catch (err) {
                setError('Failed to load vendor profile');
                console.error('Error loading vendor profile:', err);
            } finally {
                setLoading(false);
            }
        };

        loadVendor();
    }, [id]);

    const formatPrice = (price?: number) => {
        if (!price) return null;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#101c34] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading vendor profile...</p>
                </div>
            </div>
        );
    }

    if (error || !vendor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Vendor Not Found</h1>
                    <p className="text-gray-600 mb-8">{error || 'The vendor you are looking for does not exist.'}</p>
                    <button 
                        onClick={() => navigate('/vendors')}
                        className="bg-[#101c34] text-white px-6 py-3 rounded-lg hover:bg-[#0d1829] transition-colors"
                    >
                        Back to Vendors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {vendor && (
                <Helmet>
                    <title>{vendor.vendorName} - {vendor.category} in {vendor.city} | GHT</title>
                    <meta name="description" content={vendor.description || `Professional ${vendor.category} services in ${vendor.city}`} />
                    <meta name="keywords" content={`${vendor.category}, ${vendor.city}, wedding planners, event management`} />
                    <meta property="og:title" content={`${vendor.vendorName} - ${vendor.category} in ${vendor.city}`} />
                    <meta property="og:description" content={vendor.description || `Professional ${vendor.category} services in ${vendor.city}`} />
                    <meta property="og:image" content={vendor.imageUrl || 'https://globalhotelsandtourism.com/ght_logo.png'} />
                    <meta property="og:url" content={`https://globalhotelsandtourism.com/vendor/${vendor.id}`} />
                    <link rel="canonical" href={`https://globalhotelsandtourism.com/vendor/${vendor.id}`} />
                    <script type="application/ld+json">{JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": vendor.vendorName,
                        "description": vendor.description || '',
                        "address": { "@type": "PostalAddress", "addressLocality": vendor.city || '' },
                        "telephone": vendor.phone || '',
                        "email": vendor.email || '',
                        "url": vendor.websiteUrl || '',
                        "image": vendor.imageUrl || ''
                    })}</script>
                </Helmet>
            )}
            {/* Hero Section */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Image */}
                        <div className="lg:w-2/3">
                            <div className="relative">
                                <img
                                    src={selectedImage || '/placeholder.svg'}
                                    alt={vendor.vendorName}
                                    className="w-full h-96 object-cover rounded-lg"
                                />
                                
                                {/* Gallery Thumbnails */}
                                {vendor.galleryImages && vendor.galleryImages.length > 0 && (
                                    <div className="flex gap-2 mt-4 overflow-x-auto">
                                        {vendor.imageUrl && (
                                            <img
                                                src={vendor.imageUrl}
                                                alt="Main"
                                                className={`w-20 h-20 object-cover rounded cursor-pointer ${selectedImage === vendor.imageUrl ? 'ring-2 ring-[#101c34]' : ''}`}
                                                onClick={() => setSelectedImage(vendor.imageUrl!)}
                                            />
                                        )}
                                        {vendor.galleryImages.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Gallery ${index + 1}`}
                                                className={`w-20 h-20 object-cover rounded cursor-pointer ${selectedImage === image ? 'ring-2 ring-[#101c34]' : ''}`}
                                                onClick={() => setSelectedImage(image)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vendor Info */}
                        <div className="lg:w-1/3">
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <div className="flex items-center gap-3 mb-4">
                                    {vendor.imageUrl && (
                                        <img
                                            src={vendor.imageUrl}
                                            alt={vendor.vendorName}
                                            className="w-12 h-12 object-contain rounded"
                                        />
                                    )}
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{vendor.vendorName}</h1>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#e8ebf3] text-[#101c34] px-2 py-1 rounded-full text-xs font-medium">
                                                {vendor.category}
                                            </span>
                                            {vendor.featured && (
                                                <span className="bg-[#e8ebf3] text-[#101c34] px-2 py-1 rounded-full text-xs font-medium">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-gray-600">{vendor.city}</span>
                                    </div>

                                    {vendor.yearsExperience && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-gray-600">{vendor.yearsExperience} years experience</span>
                                        </div>
                                    )}

                                    {vendor.teamSize && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="text-gray-600">{vendor.teamSize}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Pricing */}
                                {(vendor.outdoorPrice || vendor.indoorPrice) && (
                                    <div className="mt-6 pt-4 border-t">
                                        <h3 className="font-semibold text-gray-900 mb-3">Starting Price</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {vendor.outdoorPrice && (
                                                <div className="text-center">
                                                    <p className="text-xs text-gray-500 mb-1">Outdoor</p>
                                                    <p className="font-bold text-[#101c34]">{formatPrice(vendor.outdoorPrice)}</p>
                                                </div>
                                            )}
                                            {vendor.indoorPrice && (
                                                <div className="text-center">
                                                    <p className="text-xs text-gray-500 mb-1">Indoor</p>
                                                    <p className="font-bold text-[#101c34]">{formatPrice(vendor.indoorPrice)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Contact Actions */}
                                <div className="mt-6 space-y-3">
                                    <button 
                                        onClick={() => setShowContactForm(true)}
                                        className="w-full bg-[#101c34] text-white py-3 rounded-lg font-medium hover:bg-[#0d1829] transition-colors"
                                    >
                                        Get Free Quote
                                    </button>
                                    
                                    {vendor.phone && (
                                        <a 
                                            href={`tel:${vendor.phone}`}
                                            className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            Call Now
                                        </a>
                                    )}
                                </div>

                                {/* Social Media */}
                                {vendor.socialMedia && Object.keys(vendor.socialMedia).length > 0 && (
                                    <div className="mt-6 pt-4 border-t">
                                        <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
                                        <div className="flex gap-3">
                                            {vendor.socialMedia.instagram && (
                                                <a href={vendor.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.32-1.295C4.198 14.553 3.5 13.117 3.5 11.5s.698-3.053 1.629-4.193c.872-.805 2.023-1.295 3.32-1.295 1.297 0 2.448.49 3.32 1.295.931 1.14 1.629 2.576 1.629 4.193s-.698 3.053-1.629 4.193c-.872.805-2.023 1.295-3.32 1.295z"/>
                                                    </svg>
                                                </a>
                                            )}
                                            {vendor.socialMedia.facebook && (
                                                <a href={vendor.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                    </svg>
                                                </a>
                                            )}
                                            {vendor.socialMedia.linkedin && (
                                                <a href={vendor.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                    </svg>
                                                </a>
                                            )}
                                            {vendor.socialMedia.youtube && (
                                                <a href={vendor.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        {vendor.aboutDescription && (
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">About Us</h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {vendor.aboutDescription}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Occasions */}
                        {vendor.occasions && vendor.occasions.length > 0 && (
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">Occasions</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {vendor.occasions.map((occasion, index) => (
                                        <div key={index} className="bg-[#f0f2f7] p-4 rounded-lg text-center">
                                            <div className="w-16 h-16 bg-[#e8ebf3] rounded-full mx-auto mb-2 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-[#101c34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.846 1.846 0 013 15.546V9.75A4.5 4.5 0 017.5 5.25h9A4.5 4.5 0 0121 9.75v5.796z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-medium text-gray-900">{occasion}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Specialties */}
                        {vendor.specialties && (
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">Our Specialties</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {vendor.specialties}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                {vendor.contactPersonName && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-gray-600">{vendor.contactPersonName}</span>
                                    </div>
                                )}
                                
                                {vendor.phone && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <a href={`tel:${vendor.phone}`} className="text-[#101c34] hover:text-[#101c34]">{vendor.phone}</a>
                                    </div>
                                )}
                                
                                {vendor.email && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <a href={`mailto:${vendor.email}`} className="text-[#101c34] hover:text-[#101c34]">{vendor.email}</a>
                                    </div>
                                )}
                                
                                {vendor.websiteUrl && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c0 4.97-4.03 9-9 9s-9-4.03-9-9m9-9v18" />
                                        </svg>
                                        <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[#101c34] hover:text-[#101c34]">Visit Website</a>
                                    </div>
                                )}
                                
                                {vendor.contactAddress && (
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-gray-600">{vendor.contactAddress}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Service Areas */}
                        {vendor.serviceAreas && (
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-bold mb-4">Service Areas</h3>
                                <p className="text-gray-600">{vendor.serviceAreas}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact Form Modal */}
            {showContactForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Get Free Quote</h3>
                            <button onClick={() => setShowContactForm(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#101c34] focus:border-[#101c34]" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#101c34] focus:border-[#101c34]" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#101c34] focus:border-[#101c34]" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Details</label>
                                <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#101c34] focus:border-[#101c34]" placeholder="Tell us about your event..."></textarea>
                            </div>
                            
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 bg-[#101c34] text-white py-3 rounded-lg font-medium hover:bg-[#0d1829] transition-colors">
                                    Send Quote Request
                                </button>
                                <button type="button" onClick={() => setShowContactForm(false)} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}