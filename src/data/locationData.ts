/**
 * Location data utilities for GHT-2
 * This file provides functions to interact with the location API endpoints
 */

// Type definitions for location data
export interface Location {
  id: number;
  city: string;
  state: string | null;
  country: string;
  image_url: string | null;
  description: string | null;
  hotel_count?: number;
  hotels?: Hotel[];
}

// Type definition for hotel data compatible with existing application
export interface Hotel {
  id: number;
  hotel_name: string;
  parent_company: string | null;
  hero_image: string | null;
  description: string | null;
  official_website: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  rating: number | null;
  city: string;
  state: string | null;
  country: string;
  city_image_url: string | null;
}

/**
 * Transform API hotel data to match the format expected by existing components
 * This helps maintain backward compatibility with components using the old data structure
 */
export function transformHotelData(apiHotel: any): any {
  return {
    'Hotel Name': apiHotel.hotel_name,
    'Parent Company': apiHotel.parent_company,
    'Hero Image': apiHotel.hero_image,
    'Description': apiHotel.description,
    'Official Website': apiHotel.official_website,
    'City': apiHotel.city,
    'State': apiHotel.state,
    'Country': apiHotel.country,
    // Additional fields for compatibility
    'Address': apiHotel.address,
    'Phone': apiHotel.phone,
    'Email': apiHotel.email,
    'Rating': apiHotel.rating,
    // Keep the original properties too
    ...apiHotel
  };
}

/**
 * Fetch all locations from the API
 */
export async function fetchLocations(): Promise<Location[]> {
  try {
    const response = await fetch('/api/locations');
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    throw error;
  }
}

/**
 * Fetch a specific location by ID with its hotels
 */
export async function fetchLocationById(id: number): Promise<Location> {
  try {
    const response = await fetch(`/api/locations/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch location with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch a location by city name (case-insensitive)
 */
export async function fetchLocationByCity(cityName: string): Promise<Location | null> {
  try {
    const locations = await fetchLocations();
    return locations.find(
      loc => loc.city.toLowerCase() === cityName.toLowerCase()
    ) || null;
  } catch (error) {
    console.error(`Failed to fetch location for city ${cityName}:`, error);
    throw error;
  }
}

/**
 * Fetch all hotels from the API
 * Returns hotels in both the API format and the legacy format for compatibility
 */
export async function fetchHotelsFromApi(): Promise<{ 
  apiFormatHotels: Hotel[], 
  legacyFormatHotels: any[] 
}> {
  try {
    const response = await fetch('/api/hotels');
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const apiFormatHotels = await response.json();
    const legacyFormatHotels = apiFormatHotels.map(transformHotelData);
    
    return { apiFormatHotels, legacyFormatHotels };
  } catch (error) {
    console.error('Failed to fetch hotels:', error);
    throw error;
  }
}

/**
 * Generate a URL-friendly slug from a location name
 */
export function slugifyLocation(city: string, state?: string | null): string {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  return state 
    ? `${citySlug}-${state.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`
    : citySlug;
}
