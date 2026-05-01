import { useState, useEffect, useRef } from 'react';
import { type Hotel } from '@/data/hotelData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/utils/imageUtils';

interface MarqueeProps {
  hotels: Hotel[];
  onHotelClick: (hotel: Hotel) => void;
}

export function MarqueeSlideshow({ hotels, onHotelClick }: MarqueeProps) {
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate animation duration based on number of items and viewport width
  useEffect(() => {
    const updateSpeed = () => {
      const viewportWidth = window.innerWidth;
      // Adjust speed based on viewport width - slower on smaller screens
      const baseSpeed = viewportWidth < 640 ? 60 : 40;
      setSpeed(baseSpeed);
    };

    updateSpeed();
    window.addEventListener('resize', updateSpeed);
    return () => window.removeEventListener('resize', updateSpeed);
  }, []);

  const handleHotelClick = (hotel: Hotel) => {
    onHotelClick(hotel);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Ensure we have at least 10 hotels by duplicating if necessary
  const displayHotels = hotels.length >= 10 ? hotels : [...hotels, ...hotels, ...hotels].slice(0, 15);

  return (
    <div className="w-full overflow-hidden relative">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-250px * ${Math.min(displayHotels.length / 2, 7)})); }
          }
          
          .marquee-container {
            animation: scroll ${speed}s linear infinite;
            animation-play-state: ${isPaused ? 'paused' : 'running'};
          }
        `
      }} />

      <div 
        ref={containerRef}
        className="marquee-container flex py-4" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* First set of cards */}
        {displayHotels.map((hotel, index) => (
          <div 
            key={`hotel-card-1-${index}`}
            className="flex-shrink-0 w-[250px] mx-4 transition-all duration-300 transform hover:scale-105 hover:z-10"
            onClick={() => handleHotelClick(hotel)}
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[350px] flex flex-col cursor-pointer">
              <div className="h-[200px] overflow-hidden">
                <img
                  src={getImageUrl(hotel['Hero Image'], 'HOTEL')}
                  alt={hotel['Hotel Name']}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getImageUrl(undefined, 'HOTEL');
                  }}
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{hotel['Hotel Name']}</h3>
                <p className="text-sm text-gray-600 mb-2">{hotel.City}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{hotel.Description}</p>
              </div>
              <div className="px-4 pb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-[#101c34] text-[#101c34] hover:bg-[#f0f2f7]"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Duplicate set for seamless looping */}
        {displayHotels.map((hotel, index) => (
          <div 
            key={`hotel-card-2-${index}`}
            className="flex-shrink-0 w-[250px] mx-4 transition-all duration-300 transform hover:scale-105 hover:z-10"
            onClick={() => handleHotelClick(hotel)}
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[350px] flex flex-col cursor-pointer">
              <div className="h-[200px] overflow-hidden">
                <img
                  src={getImageUrl(hotel['Hero Image'], 'HOTEL')}
                  alt={hotel['Hotel Name']}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getImageUrl(undefined, 'HOTEL');
                  }}
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{hotel['Hotel Name']}</h3>
                <p className="text-sm text-gray-600 mb-2">{hotel.City}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{hotel.Description}</p>
              </div>
              <div className="px-4 pb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-[#101c34] text-[#101c34] hover:bg-[#f0f2f7]"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
