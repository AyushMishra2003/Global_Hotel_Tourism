import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Megaphone, TrendingUp, Star, ArrowLeft } from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: 'Reach Thousands of Planners',
    description: 'Connect directly with a vast network of corporate and private event planners actively seeking premium venues and services.',
  },
  {
    icon: Megaphone,
    title: 'Showcase Your Brand',
    description: 'Present your brand on a premium platform with a detailed profile, high-quality photo galleries, and verified reviews.',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    description: 'Increase your bookings, gain valuable market insights, and elevate your brand presence in the competitive hospitality industry.',
  },
];

const testimonials = [
  {
    quote: "Joining Global Hotels & Tourism was a game-changer for us. Our bookings have increased by 40% in just six months!",
    name: 'Anjali Sharma',
    title: 'Manager, Royal Palace Resort, Jaipur',
  },
  {
    quote: "The platform's quality and reach are unmatched. We're connecting with high-value clients we couldn't reach before.",
    name: 'Vikram Singh',
    title: 'Owner, Grand Celebration Banquets, Delhi',
  },
  {
    quote: "The support from the GHT team is fantastic. They truly care about helping their partners succeed.",
    name: 'Priya Mehta',
    title: 'Director, Lakeside Resort & Spa, Udaipur',
  },
];

const VendorBenefits = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#f0f2f7]">
      {/* Go Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-[#f0f2f7] border border-[#101c34] text-[#101c34] font-semibold rounded-full px-4 py-2 hover:bg-[#e8ebf3] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>
      </div>
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 text-center bg-white/60">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Partner with India's Premier
            <br />
            <span className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] bg-clip-text text-transparent">
              Hospitality Network
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8"> {/* No change here */}
            Showcase your venue to thousands of event planners and grow your business with Global Hotels & Tourism.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] px-8 py-3 text-lg">
            <Link to="/vendor-registration">Start Your Application</Link>
          </Button>
        </div>
      </section>

      {/* Why Join Us? Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Join Global Hotels and Tourism?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We provide the tools and exposure you need to thrive in the digital age.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center p-6 bg-white/90 backdrop-blur-sm border-[#b8c0d8]/30 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-16 h-16 bg-[#e8ebf3] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-[#101c34]" />
                  </div>
                  <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                  <CardContent className="p-0">
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white/60">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">From Our Happy Vendors</h2>
            <p className="text-gray-600 text-lg">Don't just take our word for it. Here's what our partners say.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex text-[#101c34] mb-4"> {/* No change here */}
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                  </div>
                  <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center"> {/* No change here */}
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                    <div>
                      <p className="font-semibold text-gray-800">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div> {/* No change here */}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Elevate Your Business?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Join a curated network of India's finest hospitality providers. Start your journey with us today.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] px-10 py-4 text-xl"
            >
              <Link to="/vendor-registration">Start Your Application</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorBenefits;