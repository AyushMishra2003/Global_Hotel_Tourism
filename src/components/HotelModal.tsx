import React from 'react'
import { Button } from '@/components/ui/button'
import { type Hotel } from '@/data/hotelData'
import { getImageUrl } from '@/utils/imageUtils'

interface HotelModalProps {
  hotel: Hotel | null
  open: boolean
  onClose: () => void
}

const HotelModal: React.FC<HotelModalProps> = ({ hotel, open, onClose }) => {
  if (!open || !hotel) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">{hotel['Hotel Name']}</h2>
        <p className="mb-2 text-gray-600">{hotel.City} • {hotel['Parent Company']}</p>
        <img 
          src={getImageUrl(hotel['Hero Image'], 'hotel')} 
          alt={hotel['Hotel Name']} 
          className="w-full h-56 object-cover rounded mb-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== getImageUrl(undefined, 'hotel')) {
              target.src = getImageUrl(undefined, 'hotel');
            }
          }}
        />
        <p className="mb-4 text-gray-700">{hotel.Description}</p>
        <Button onClick={() => window.open(hotel['Official Website'], '_blank')} className="w-full bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] mb-2">
          Visit Website
        </Button>
        <Button variant="outline" className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

export default HotelModal
