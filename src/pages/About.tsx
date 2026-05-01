import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Globe,
  Building2,
  Users,
  TrendingUp,
  MapPin,
  Handshake,
  Award,
  Star,
  Hotel,
} from 'lucide-react';

/* ─── Content ─────────────────────────────────────────── */

const stats = [
  { value: '500+', label: 'Hotels & Venues', icon: Hotel },
  { value: '50+',  label: 'Cities Covered',   icon: MapPin },
  { value: '1000+',label: 'Registered Vendors',icon: Users },
  { value: '10+',  label: 'Years of Excellence',icon: Award },
];

const pillars = [
  {
    icon: Building2,
    title: 'Premium Hospitality Network',
    description:
      "We curate and connect India's finest hotels, resorts, banquets, and venues with event planners, travellers, and corporate clients seeking exceptional experiences.",
  },
  {
    icon: Globe,
    title: 'Pan-India Presence',
    description:
      'From metro cities to scenic destinations, our platform covers 50+ cities — ensuring every client finds the perfect venue regardless of location.',
  },
  {
    icon: Handshake,
    title: 'Trusted Partnerships',
    description:
      'We build long-term, trust-based relationships with hospitality partners by offering verified listings, transparent reviews, and dedicated account support.',
  },
  {
    icon: TrendingUp,
    title: 'Business Growth',
    description:
      'Our platform empowers hotels and vendors to grow their brand presence, attract high-value clients, and increase bookings through targeted digital exposure.',
  },
];

const team = [
  {
    name: 'Rajiv Sharma',
    title: 'Founder & CEO',
    role: 'Hospitality Visionary',
    bio: '20+ years in luxury hospitality across India and Southeast Asia. Former GM at Taj Hotels.',
    initials: 'RS',
  },
  {
    name: 'Priya Mehta',
    title: 'Co-Founder & COO',
    role: 'Operations & Strategy',
    bio: 'Ex-IHG executive with deep expertise in hotel operations and strategic partnerships.',
    initials: 'PM',
  },
  {
    name: 'Arjun Kapoor',
    title: 'Head of Partnerships',
    role: 'Vendor Relations',
    bio: 'Brings 15 years of experience building hospitality networks across Tier-1 and Tier-2 cities.',
    initials: 'AK',
  },
  {
    name: 'Sunita Rao',
    title: 'Head of Marketing',
    role: 'Brand & Digital',
    bio: 'Digital marketing strategist with a proven track record in travel and luxury lifestyle brands.',
    initials: 'SR',
  },
  {
    name: 'Amit Verma',
    title: 'CTO',
    role: 'Technology & Product',
    bio: 'Full-stack architect who previously built discovery platforms for travel companies in India and the UAE.',
    initials: 'AV',
  },
  {
    name: 'Neha Gupta',
    title: 'Head of Client Success',
    role: 'Customer Experience',
    bio: 'Passionate about turning first-time users into lifelong advocates through exceptional service journeys.',
    initials: 'NG',
  },
];

const faqs = [
  {
    question: 'What is Global Hotels & Tourism?',
    answer:
      'Global Hotels and Tourism – A Royal Affair is a hospitality and wedding industry platform dedicated to connecting hotels, resorts, wedding planners, event professionals, and tourism partners on one powerful network. We focus on promoting excellence in hospitality by bringing together the best venues, vendors, and professionals.',
  },
  {
    question: 'How does GHT support the wedding industry?',
    answer:
      'We empower couples with the finest venue choices and end-to-end wedding planning solutions, while helping hotels and venue partners grow their visibility and bookings. Through innovative strategies and personalised services, we create experiences that are not just events, but lifelong memories.',
  },
  {
    question: 'How can my hotel or venue join the platform?',
    answer:
      'You can register as a vendor through our "Join as Vendor" page. After submitting your details, our partnerships team will reach out within 48 hours to guide you through the onboarding process and set up your verified profile.',
  },
  {
    question: 'What makes GHT different from other listing platforms?',
    answer:
      'GHT is more than a directory — it is a business growth ecosystem. We offer verified listings, expert reviews, industry networking, promotional opportunities, and dedicated account support. Our goal is to increase your credibility, build your reputation, and expand your reach in the hospitality and wedding market.',
  },
];

/* ─── Component ───────────────────────────────────────── */

const About = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative bg-[#111111] text-white overflow-hidden">
        {/* subtle background texture */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDM0di0yaDF2LTFoMXYxem0wLTMwdjJoLTJ2LTJoMXYtMWgxdjF6TTYgNHYySDR2LTJoMVYzaDFWNHptMCAzMHYySDR2LTJoMVYzM2gxVjM0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-red-700/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-red-900/10 blur-[100px]" />
        </div>

        {/* Go Back */}
        <div className="relative container mx-auto px-4 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 border border-white/20 text-white/80 text-sm rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-4">
            India's Premier Hospitality Platform
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-4" style={{ fontFamily: 'var(--font-head)' }}>
            Global Hotels{' '}
            <span className="text-red-500">and</span>
            <br />Tourism
          </h1>
          <p className="text-white/60 text-lg md:text-xl mt-4 mb-10 max-w-xl mx-auto">
            Bridging the Gap Between Property Owners and To-Be-Weds
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 rounded-full">
              <Link to="/all-hotels">Explore Hotels</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 rounded-full">
              <Link to="/join-as-vendor">Join as Partner</Link>
            </Button>
          </div>
        </div>

        {/* Bottom curve */}
        <div className="relative">
          <svg viewBox="0 0 1440 60" className="block w-full" preserveAspectRatio="none" style={{ height: 60 }}>
            <path d="M0,60 C360,0 1080,60 1440,10 L1440,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center group cursor-default">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-red-600 flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold text-[#111]">{s.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About / Who We Are ────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* section label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-1 bg-red-500 rounded-full inline-block" />
              <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">Who We Are</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'var(--font-head)' }}>
              A Royal Affair in Hospitality
            </h2>

            <div className="space-y-5 text-gray-600 text-base md:text-lg leading-relaxed">
              <p>
                <strong className="text-gray-900">Global Hotels and Tourism – A Royal Affair</strong> is a hospitality and wedding industry platform dedicated to connecting hotels, resorts, wedding planners, event professionals, and tourism partners on one powerful network. Located in India, Global Hotels and Tourism focuses on promoting excellence in hospitality by bringing together the best venues, vendors, and professionals from the wedding and tourism industry. The platform provides opportunities for business growth, brand visibility, and meaningful industry connections.
              </p>
              <p>
                The main vision of Global Hotels and Tourism is to recognize and celebrate excellence in the wedding, event, and hospitality industry. Through innovation, creativity, and professional collaboration, we aim to inspire industry leaders and create a community of skilled professionals who deliver outstanding experiences and exceptional service to clients across the country.
              </p>
              <p>
                Global Hotels and Tourism also works as a strong business platform where hotels, resorts, event planners, tourism brands, and MICE professionals can showcase their services and connect with potential clients and partners. Through expert reviews, industry networking, and promotional opportunities, the platform helps brands increase credibility, build reputation, and expand their reach in the hospitality and wedding market.
              </p>
              <p>
                With a dedicated team of hospitality strategists, marketing experts, and industry professionals, Global Hotels and Tourism continuously works towards elevating industry standards. Our goal is to create a trusted community where businesses grow together, collaborations happen, and every event, destination, and hospitality experience turns into a memorable story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ──────────────────────────── */}
      <section className="py-20 px-4 bg-white overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-1 bg-red-500 rounded-full inline-block" />
              <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">Our Purpose</span>
              <span className="w-10 h-1 bg-red-500 rounded-full inline-block" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-head)' }}>
              Vision &amp; Mission
            </h2>
          </div>

          {/* Overlapping circles layout — IWIA style */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-0 max-w-4xl mx-auto">
            {/* Vision — red circle */}
            <div className="relative z-10 w-72 h-72 md:w-80 md:h-80 rounded-full bg-red-600 text-white flex flex-col items-center justify-center text-center p-10 shadow-2xl md:-mr-10">
              <Star className="w-7 h-7 mb-3 text-red-200" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-head)' }}>Vision</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                To redefine the wedding and hospitality experience by creating a seamless and trusted platform for couples, venue partners, and hospitality brands — bringing together luxury, convenience, and transparency.
              </p>
            </div>

            {/* Mission — dark circle */}
            <div className="relative z-0 w-72 h-72 md:w-80 md:h-80 rounded-full bg-[#111111] text-white flex flex-col items-center justify-center text-center p-10 shadow-2xl md:-ml-10 mt-[-40px] md:mt-0">
              <Award className="w-7 h-7 mb-3 text-gray-400" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-head)' }}>Mission</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                To empower couples with the finest venue choices and end-to-end wedding planning solutions while helping hotels and venue partners grow their visibility and bookings through innovation and personalised service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Do ────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-1 bg-red-500 rounded-full inline-block" />
              <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">What We Do</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-head)' }}>
              Four Pillars of Our Commitment
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg border border-gray-100 hover:border-red-100 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-red-600 flex items-center justify-center mb-5 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">0{i + 1}</div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Leadership ────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-1 bg-red-500 rounded-full inline-block" />
              <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">Our Team</span>
              <span className="w-10 h-1 bg-red-500 rounded-full inline-block" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-head)' }}>
              Driven by Experienced Industry Leaders
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our founding team brings together decades of experience from India's top hotel chains, wedding management companies, and technology firms.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="group bg-white border border-gray-100 rounded-2xl p-6 flex gap-5 items-start shadow-sm hover:shadow-lg hover:border-red-100 transition-all duration-300"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-[#111] text-white flex items-center justify-center flex-shrink-0 font-bold text-base group-hover:bg-red-600 transition-colors duration-300">
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-tight">{member.name}</h3>
                  <p className="text-red-500 text-sm font-medium mt-0.5">{member.title}</p>
                  <p className="text-gray-400 text-xs mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────── */}
      <section className="py-24 px-4 bg-[#111111] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-red-700/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-red-900/20 blur-[80px]" />
        <div className="container mx-auto text-center relative">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-8 h-0.5 bg-red-500 inline-block" />
            <span className="text-red-400 text-sm font-semibold uppercase tracking-widest">Join the Movement</span>
            <span className="w-8 h-0.5 bg-red-500 inline-block" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-5" style={{ fontFamily: 'var(--font-head)' }}>
            Be Part of India's Hospitality Movement
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you're a hotel looking to grow, a vendor wanting visibility, or a couple seeking the perfect wedding venue — GHT is your platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 rounded-full">
              <Link to="/join-as-vendor">Join as a Partner</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 rounded-full">
              <Link to="/inquiry">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-1 bg-red-500 rounded-full inline-block" />
              <span className="text-red-500 text-sm font-semibold uppercase tracking-widest">FAQ</span>
              <span className="w-10 h-1 bg-red-500 rounded-full inline-block" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-head)' }}>
              A Quick Guide to Understanding GHT
            </h2>
            <p className="text-gray-500">Answers to the questions we hear most often.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 pt-1 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Strip ─────────────────────────────── */}
      <section className="py-10 px-4 bg-[#111111] text-white">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <a href="https://globalhotelsandtourism.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <Globe className="w-4 h-4 text-red-500" />
              Globalhotelsandtourism.com
            </a>
            <a href="mailto:contact@globalhotelsandtourism.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <Mail className="w-4 h-4 text-red-500" />
              contact@globalhotelsandtourism.com
            </a>
            <a href="tel:+919810261007" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-red-500" />
              +91 9810261007
            </a>
            <a href="tel:+918076885774" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-red-500" />
              +91 8076885774
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
