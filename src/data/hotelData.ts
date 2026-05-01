export interface Hotel {
    State?: string;
    City: string;
    country?: string;
    "Parent Company": string;
    "Sub-brand": string;
    "Hotel Name": string;
    Description: string;
    "Official Website": string;
    "Hero Image": string;
}

// Environment-based API URL configuration
const API_URL = import.meta.env.MODE === 'development' 
  ? 'https://globalhotelsandtourism.com/backend/api/get_hotels.php' // Use absolute URL in development
  : '/backend/api/get_hotels.php'; // Use relative URL in production

/**
 * Fetches hotel data from the backend API.
 * @returns A promise that resolves to an array of Hotel objects.
 */
export const fetchHotels = async (): Promise<Hotel[]> => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        // Try to parse JSON safely
        const text = await response.text();
        
        try {
            const rawData = JSON.parse(text);
            
            // Transform the data to match our interface
            const data: Hotel[] = rawData.map((hotel: any) => ({
                State: hotel.state || '',
                City: hotel.city || '',
                country: hotel.country || '',
                "Parent Company": hotel.parent_company || '',
                "Sub-brand": hotel.sub_brand || '',
                "Hotel Name": hotel.hotel_name || '',
                Description: hotel.description || '',
                "Official Website": hotel.website_url || '',
                "Hero Image": hotel.hero_image_url || ''
            }));
            
            // Add some sample international hotels for testing
            const internationalHotels: Hotel[] = [
                {
                    City: "Dubai",
                    country: "United Arab Emirates",
                    "Parent Company": "Jumeirah",
                    "Sub-brand": "Jumeirah",
                    "Hotel Name": "Burj Al Arab",
                    Description: "Step beyond our doors into an oasis of profound tranquility. We have masterfully blended timeless elegance with the finest contemporary luxury.",
                    "Official Website": "https://www.jumeirah.com/en/stay/dubai/burj-al-arab-jumeirah",
                    "Hero Image": "/internationalDestination/UAE.jpg"
                },
                {
                    City: "Dubai",
                    country: "United Arab Emirates",
                    "Parent Company": "Atlantis",
                    "Sub-brand": "Kerzner International Holdings",
                    "Hotel Name": "Atlantis The Palm",
                    Description: "We invite you to experience a world of refined sophistication, where every detail is meticulously curated to delight the senses.",
                    "Official Website": "https://www.atlantis.com/atlantis-the-palm",
                    "Hero Image": "/internationalDestination/UAE.jpg"
                },
                {
                    City: "Dubai",
                    country: "United Arab Emirates",
                    "Parent Company": "Jumeirah",
                    "Sub-brand": "Jumeirah",
                    "Hotel Name": "Jumeirah Al Naseem",
                    Description: "Conceived as an exclusive sanctuary for the discerning global traveler, our hotel offers a private and sophisticated retreat.",
                    "Official Website": "https://www.jumeirah.com/en/stay/dubai/jumeirah-al-naseem",
                    "Hero Image": "/internationalDestination/UAE.jpg"
                },
                {
                    City: "Bangkok",
                    country: "Thailand",
                    "Parent Company": "Mandarin Oriental",
                    "Sub-brand": "Mandarin Oriental",
                    "Hotel Name": "Mandarin Oriental Bangkok",
                    Description: "A legendary hotel on the banks of the Chao Phraya River, offering unparalleled luxury and Thai hospitality.",
                    "Official Website": "https://www.mandarinoriental.com/bangkok",
                    "Hero Image": "/internationalDestination/thiland.jpeg"
                },
                {
                    City: "Phuket",
                    country: "Thailand",
                    "Parent Company": "Banyan Tree",
                    "Sub-brand": "Banyan Tree",
                    "Hotel Name": "Banyan Tree Phuket",
                    Description: "An all-pool villa resort offering privacy and luxury in a tropical setting with stunning views.",
                    "Official Website": "https://www.banyantree.com/thailand/phuket",
                    "Hero Image": "/internationalDestination/thiland.jpeg"
                },
                {
                    City: "Male",
                    country: "Maldives",
                    "Parent Company": "One&Only",
                    "Sub-brand": "One&Only",
                    "Hotel Name": "One&Only Reethi Rah",
                    Description: "An ultra-luxury resort in the Maldives offering overwater villas and pristine beaches.",
                    "Official Website": "https://www.oneandonlyresorts.com/maldives",
                    "Hero Image": "/internationalDestination/maldives.jpeg"
                },
                {
                    City: "Kuala Lumpur",
                    country: "Malaysia",
                    "Parent Company": "Mandarin Oriental",
                    "Sub-brand": "Mandarin Oriental",
                    "Hotel Name": "Mandarin Oriental Kuala Lumpur",
                    Description: "A sophisticated urban retreat in the heart of Malaysia's capital with world-class amenities.",
                    "Official Website": "https://www.mandarinoriental.com/kuala-lumpur",
                    "Hero Image": "/internationalDestination/malasiya.jpeg"
                }
            ];
            
            return [...data, ...internationalHotels];
        } catch (parseError) {
            console.error('❌ Hotel API did not return valid JSON:', text);
            return [];
        }
    } catch (error) {
        console.error('❌ There was a problem fetching the hotel data:', error);
        return []; // Return an empty array on failure
    }
};

/**
 * Truncates a string to a specified number of words.
 * @param description The string to truncate.
 * @param wordLimit The maximum number of words.
 * @returns The truncated string.
 */
export const truncateDescription = (description: string, wordLimit: number): string => {
    if (!description) return '';
    const words = description.split(' ');
    if (words.length <= wordLimit) {
        return description;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
};

/**
 * Converts a string into a URL-friendly slug.
 * @param text The string to convert.
 * @returns The slugified string.
 */
export const slugify = (text: string): string => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-'); // Replace multiple - with single -
};

/**
 * Normalizes city names to handle variations like "Delhi NCR" and "New Delhi".
 * @param cityName The city name to normalize.
 * @returns The normalized city name.
 */
export const normalizeCityName = (cityName: string): string => {
    if (!cityName) return '';
    
    const normalized = cityName.trim();
    
    // Combine Delhi NCR and New Delhi under "New Delhi"
    if (normalized.toLowerCase() === 'delhi ncr' || 
        normalized.toLowerCase() === 'new delhi' ||
        normalized.toLowerCase() === 'delhi') {
        return 'New Delhi';
    }
    
    return normalized;
};