import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { type Hotel } from '@/data/hotelData';

interface CarouselProps {
  hotels: Hotel[];
  onHotelClick: (hotel: Hotel) => void;
}

export const Carousel: React.FC<CarouselProps> = ({ hotels, onHotelClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(3);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setSlidesPerView(3);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-advance the carousel
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, slidesPerView]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % Math.max(0, hotels.length - slidesPerView + 1));
    setTimeout(() => setIsAnimating(false), 750); // Match transition duration
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + Math.max(0, hotels.length - slidesPerView + 1)) % Math.max(0, hotels.length - slidesPerView + 1));
    setTimeout(() => setIsAnimating(false), 750); // Match transition duration
  };

  if (hotels.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
            width: `${(hotels.length * 100) / slidesPerView}%`
          }}
        >
          {hotels.map((hotel, index) => (
            <div
              key={hotel['Hotel Name'] + index}
              className="w-full md:w-1/2 xl:w-1/3 flex-shrink-0 p-4"
            >
              <Card
                className="group/card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden w-full cursor-pointer h-full border border-gray-100"
                onClick={() => onHotelClick(hotel)}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={hotel['Hero Image']}
                    alt={hotel['Hotel Name']}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-[#e8ebf3]/90 backdrop-blur-sm text-[#101c34] text-xs font-medium px-2 py-1 rounded-full">
                    {hotel.City}
                  </div>
                </div>
                <CardHeader className="py-4 px-5">
                  <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1">{hotel['Hotel Name']}</CardTitle>
                  <CardDescription className="line-clamp-1 text-[#101c34] font-medium">
                    {hotel['Parent Company'] || 'Luxury Resort'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                    {hotel.Description}
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] text-white font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(hotel['Official Website'], '_blank');
                    }}
                  >
                    Explore Property
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg opacity-90 hover:opacity-100 transition-all duration-300 hover:bg-white disabled:opacity-30 z-10"
        disabled={currentIndex === 0}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-[#101c34]" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg opacity-90 hover:opacity-100 transition-all duration-300 hover:bg-white disabled:opacity-30 z-10"
        disabled={currentIndex >= hotels.length - slidesPerView}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-[#101c34]" />
      </button>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: Math.max(0, hotels.length - slidesPerView + 1) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setCurrentIndex(idx);
              setTimeout(() => setIsAnimating(false), 750);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === idx 
                ? 'bg-[#101c34] scale-110' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
