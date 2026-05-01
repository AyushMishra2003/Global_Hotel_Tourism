
import { Award, Star, Trophy, Crown, Medal, FileText, SearchCheck, Award as AwardIcon, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const awardTiers = [
  {
    name: 'Pinnacle',
    icon: Crown,
    gradient: 'from-[#101c34] to-[#2a3f6b]',
    description: 'The highest recognition for exceptional hospitality excellence',
    criteria: ['Outstanding guest satisfaction (4.8+ rating)', 'Innovative services and amenities', 'Exceptional staff training and service', 'Sustainable business practices', 'Community engagement'],
    benefits: ['Premium listing placement', 'Pinnacle badge on profile', 'Featured in marketing materials', 'Annual recognition ceremony', 'PR and media coverage']
  },
  {
    name: 'Excellence',
    icon: Trophy,
    gradient: 'from-blue-400 to-blue-600',
    description: 'Recognition for consistently superior service and quality',
    criteria: ['High guest satisfaction (4.5+ rating)', 'Quality facilities and services', 'Professional staff and management', 'Positive community impact', 'Business growth and innovation'],
    benefits: ['Enhanced profile visibility', 'Excellence badge display', 'Newsletter features', 'Award ceremony invitation', 'Marketing support']
  },
  {
    name: 'Distinction',
    icon: Medal,
    gradient: 'from-green-400 to-green-600',
    description: 'Acknowledgment of quality service and commitment to hospitality',
    criteria: ['Good guest satisfaction (4.0+ rating)', 'Reliable service delivery', 'Well-maintained facilities', 'Customer-focused approach', 'Industry best practices'],
    benefits: ['Profile badge recognition', 'Award certificate', 'Community recognition', 'Networking opportunities', 'Industry credibility']
  }
];

const nominationSteps = [
  {
    step: 1,
    title: 'Submit Application',
    description: 'Complete our comprehensive nomination form with details about your hospitality business and achievements.',
    icon: FileText
  },
  {
    step: 2,
    title: 'Review Process',
    description: 'Our expert panel evaluates all submissions based on strict criteria, ensuring fairness and integrity.',
    icon: SearchCheck
  },
  {
    step: 3,
    title: 'Winners Announced',
    description: 'Successful nominees are celebrated and recognized across our platforms and at exclusive events.',
    icon: AwardIcon
  }
];

const Awards = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#b8c0d8]/30">
        <div className="container mx-auto px-4 py-6 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center gap-2 bg-[#f0f2f7] border border-[#101c34] text-[#101c34] font-semibold rounded-full px-4 py-2 hover:bg-[#e8ebf3] transition-colors shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#101c34] to-[#2a3f6b] rounded-full flex items-center justify-center mr-3">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Excellence Awards Program</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We invite India&apos;s finest hospitality partners to be recognized for their dedication to excellence.
            </p>
          </div>
        </div>
      </header>

      {/* Award Tiers Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Our <span className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] bg-clip-text text-transparent">Award Categories</span>
              : Three Tiers of Excellence
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Our annual awards program honors the finest venues, hotels, and service providers who consistently deliver extraordinary experiences to guests and event planners.
            </p>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Three Tiers of Excellence</h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our comprehensive award system recognizes different levels of achievement, ensuring every outstanding hospitality partner gets the recognition they deserve.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {awardTiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <Card key={tier.name} className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300">
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${tier.gradient}`} />
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${tier.gradient} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{tier.name} Award</CardTitle>
                    <CardDescription className="text-base">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Award Criteria</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          {tier.criteria.map((criterion, idx) => (
                            <li key={idx} className="flex items-start">
                              <Star className="w-4 h-4 text-[#101c34] mr-2 mt-0.5 flex-shrink-0" />
                              {criterion}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Benefits</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          {tier.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start">
                              <Award className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Get Nominated Section */}
      <section className="py-16 px-4 bg-white/60">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">How to Get Nominated</h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our streamlined process ensures a fair and transparent evaluation for all aspiring nominees.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {nominationSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <Card key={step.step} className="text-center p-6 bg-white/90 backdrop-blur-sm border-[#b8c0d8]/30 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-16 h-16 bg-[#e8ebf3] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-[#101c34]" />
                  </div>
                  <CardTitle className="text-xl mb-2">Step {step.step}: {step.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {step.description}
                  </CardDescription>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Be Recognized?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Join the ranks of India's most prestigious hospitality partners.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] px-8 py-3"
            >
              <Link to="/vendor-registration">Submit Your Nomination</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Awards;
