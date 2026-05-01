import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// The live API endpoint for creating a registration
const API_URL = 'https://globalhotelsandtourism.com/backend/api/create_registration.php';

const cities = [
  'Delhi', 'Jaipur', 'Udaipur', 'Agra', 'Amritsar', 
  'Lucknow', 'Chandigarh', 'Shimla', 'Dehradun', 'Varanasi'
];

const categories = [
  { value: 'hotel', label: 'Hotel', description: 'Luxury hotels and boutique properties' },
  { value: 'banquet', label: 'Banquet Hall', description: 'Wedding and event banquet facilities' },
  { value: 'resort', label: 'Resort', description: 'Destination resorts and retreat venues' },
  { value: 'destination', label: 'Destination Venue', description: 'Unique event destinations and heritage properties' },
  { value: 'caterer', label: 'Caterer', description: 'Professional catering and food services' }
];

const VendorRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    city: '',
    contactPersonName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    establishedYear: '',
    capacity: '',
    priceRangeMin: '',
    priceRangeMax: '',
    amenities: '',
    website: '',
    socialMedia: '',
    specializations: ''
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Registration Submitted Successfully!",
          description: "Your vendor registration has been submitted for review. We'll contact you within 48 hours.",
        });
        setStep(4); // Move to success step
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: errorData.message || "An unknown error occurred.",
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Could not connect to the server. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-800">Registration Submitted!</CardTitle>
            <CardDescription>Thank you for your interest in joining Global Hotels & Tourism network.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="bg-[#f0f2f7] p-4 rounded-lg border border-[#b8c0d8]">
                <h4 className="font-semibold text-[#101c34] mb-2">What's Next?</h4>
                <ul className="text-sm text-[#101c34] space-y-1">
                  <li>• Our team will review your application</li>
                  <li>• We'll contact you within 48 hours</li>
                  <li>• Complete profile setup after approval</li>
                  <li>• Start receiving booking inquiries</li>
                </ul>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-[#101c34] to-[#2a3f6b]" onClick={() => window.location.href = '/'}>
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-[#f0f2f7] border border-[#101c34] text-[#101c34] font-semibold rounded-full px-4 py-2 hover:bg-[#e8ebf3] transition-colors shadow-sm mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Our Vendor Network</h1>
            <p className="text-gray-600">Connect with thousands of event planners across India</p>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= num ? 'bg-[#101c34] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {num}
                </div>
                {num < 3 && <div className={`w-12 h-1 mx-2 ${step > num ? 'bg-[#101c34]' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-8 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-[#101c34] font-medium' : ''}>Basic Info</span>
            <span className={step >= 2 ? 'text-[#101c34] font-medium' : ''}>Business Details</span>
            <span className={step >= 3 ? 'text-[#101c34] font-medium' : ''}>Additional Info</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                {step === 1 && 'Basic Information'}
                {step === 2 && 'Business Details'}
                {step === 3 && 'Additional Information'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Tell us about your business and location'}
                {step === 2 && 'Provide details about your services and capacity'}
                {step === 3 && 'Add extra details to make your profile stand out'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                      <Input type="text" placeholder="Enter your business name" value={formData.businessName} onChange={(e) => handleInputChange('businessName', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#101c34] focus:border-transparent" value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                      </select>
                    </div>
                  </div>
                  {formData.category && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>{categories.find(c => c.value === formData.category)?.label}:</strong>{' '}{categories.find(c => c.value === formData.category)?.description}
                      </p>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary City *</label>
                      <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#101c34] focus:border-transparent" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} required>
                        <option value="">Select City</option>
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name *</label>
                      <Input type="text" placeholder="Your full name" value={formData.contactPersonName} onChange={(e) => handleInputChange('contactPersonName', e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <Input type="email" placeholder="business@example.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <Input type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
                    <Textarea placeholder="Enter your complete business address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Description *</label>
                    <Textarea placeholder="Describe your business, services, and what makes you unique..." value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} required rows={4} />
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
                      <Input type="number" placeholder="2020" value={formData.establishedYear} onChange={(e) => handleInputChange('establishedYear', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Capacity *</label>
                      <Input type="number" placeholder="300" value={formData.capacity} onChange={(e) => handleInputChange('capacity', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                      <Input type="text" placeholder="Weddings, Corporate Events" value={formData.specializations} onChange={(e) => handleInputChange('specializations', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹) - Minimum</label>
                      <Input type="number" placeholder="5000" value={formData.priceRangeMin} onChange={(e) => handleInputChange('priceRangeMin', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹) - Maximum</label>
                      <Input type="number" placeholder="50000" value={formData.priceRangeMax} onChange={(e) => handleInputChange('priceRangeMax', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amenities & Features</label>
                    <Textarea placeholder="List your key amenities (e.g., AC, Parking, Sound System, Catering, WiFi...)" value={formData.amenities} onChange={(e) => handleInputChange('amenities', e.target.value)} rows={3} />
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                      <Input type="url" placeholder="https://yourwebsite.com" value={formData.website} onChange={(e) => handleInputChange('website', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Social Media</label>
                      <Input type="text" placeholder="Instagram, Facebook handles" value={formData.socialMedia} onChange={(e) => handleInputChange('socialMedia', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Business Photos</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#101c34] transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload photos of your venue/services</p>
                      <p className="text-sm text-gray-500">JPG, PNG up to 10MB each (Max 10 photos)</p>
                      <Button type="button" variant="outline" className="mt-4">Choose Files</Button>
                    </div>
                  </div>
                  <div className="bg-[#f0f2f7] p-6 rounded-lg border border-[#b8c0d8]">
                    <h4 className="font-semibold text-[#101c34] mb-3">Registration Process</h4>
                    <ul className="text-sm text-[#101c34] space-y-2">
                      <li className="flex items-start"><Badge className="bg-[#d0d6e8] text-[#101c34] mr-3 mt-0.5">1</Badge>Submit this registration form with all required details</li>
                      <li className="flex items-start"><Badge className="bg-[#d0d6e8] text-[#101c34] mr-3 mt-0.5">2</Badge>Our team reviews your application within 48 hours</li>
                      <li className="flex items-start"><Badge className="bg-[#d0d6e8] text-[#101c34] mr-3 mt-0.5">3</Badge>Upon approval, complete your detailed vendor profile</li>
                      <li className="flex items-start"><Badge className="bg-[#d0d6e8] text-[#101c34] mr-3 mt-0.5">4</Badge>Start receiving booking inquiries from event planners</li>
                    </ul>
                  </div>
                </>
              )}
              <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1} className={step === 1 ? 'invisible' : ''}>
                  Previous
                </Button>
                {step < 3 ? (
                  <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b]">
                    Next Step
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b]">
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default VendorRegistration;