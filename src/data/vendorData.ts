/**
 * This file contains the type definition for a Vendor and the function
 * to fetch vendor data from the backend API.
 */

/**
 * Interface representing a single vendor.
 * The keys match the camelCase format from the get_vendors.php API.
 */
export interface Vendor {
    id: number;
    vendorName: string;
    contactPersonName: string;
    category: string;
    city: string;
    phone: string;
    email: string;
    websiteUrl: string;
    imageUrl?: string;
    description?: string;
    featured?: boolean;
    aboutDescription?: string;
    outdoorPrice?: number;
    indoorPrice?: number;
    serviceAreas?: string;
    occasions?: string[];
    galleryImages?: string[];
    socialMedia?: {
        instagram?: string;
        facebook?: string;
        linkedin?: string;
        youtube?: string;
    };
    contactAddress?: string;
    yearsExperience?: number;
    teamSize?: string;
    specialties?: string;
    createdAt?: string;
}

// Environment-based API URL configuration
const VENDORS_API_URL = import.meta.env.MODE === 'development' 
  ? 'https://globalhotelsandtourism.com/backend/api/get_vendors.php' // Use absolute URL in development
  : '/backend/api/get_vendors.php'; // Use relative URL in production

const VENDOR_PROFILE_API_URL = import.meta.env.MODE === 'development' 
  ? 'https://globalhotelsandtourism.com/backend/api/get_vendor_profile.php' // Use absolute URL in development
  : '/backend/api/get_vendor_profile.php'; // Use relative URL in production

/**
 * Fetches vendor data from the backend API.
 * @returns A promise that resolves to an array of Vendor objects.
 */
export const fetchVendors = async (): Promise<Vendor[]> => {
    try {
        const response = await fetch(VENDORS_API_URL);
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        // Try to parse JSON safely
        const text = await response.text();
        try {
            // Parse the raw data
            const rawData = JSON.parse(text);
            // Map backend keys (snake_case) to frontend keys (camelCase)
            const data: Vendor[] = Array.isArray(rawData)
                ? rawData.map((v: Record<string, unknown>) => ({
                    id: typeof v.id === 'number' ? v.id : 0,
                    vendorName: typeof v.vendorName === 'string' ? v.vendorName : typeof v.vendor_name === 'string' ? v.vendor_name : '',
                    contactPersonName: typeof v.contactPersonName === 'string' ? v.contactPersonName : typeof v.contact_person_name === 'string' ? v.contact_person_name : '',
                    category: typeof v.category === 'string' ? v.category : '',
                    city: typeof v.city === 'string' ? v.city : '',
                    phone: typeof v.phone === 'string' ? v.phone : '',
                    email: typeof v.email === 'string' ? v.email : '',
                    websiteUrl: typeof v.websiteUrl === 'string' ? v.websiteUrl : typeof v.website_url === 'string' ? v.website_url : '',
                    imageUrl: typeof v.imageUrl === 'string' ? v.imageUrl : typeof v.image_url === 'string' ? v.image_url : undefined,
                    description: typeof v.description === 'string' ? v.description : undefined,
                    featured: Boolean(v.featured),
                    aboutDescription: typeof v.aboutDescription === 'string' ? v.aboutDescription : undefined,
                    outdoorPrice: typeof v.outdoorPrice === 'number' ? v.outdoorPrice : undefined,
                    indoorPrice: typeof v.indoorPrice === 'number' ? v.indoorPrice : undefined,
                    serviceAreas: typeof v.serviceAreas === 'string' ? v.serviceAreas : undefined,
                    occasions: Array.isArray(v.occasions) ? v.occasions : undefined,
                    galleryImages: Array.isArray(v.galleryImages) ? v.galleryImages : undefined,
                    socialMedia: typeof v.socialMedia === 'object' && v.socialMedia ? v.socialMedia as { instagram?: string; facebook?: string; linkedin?: string; youtube?: string; } : undefined,
                    contactAddress: typeof v.contactAddress === 'string' ? v.contactAddress : undefined,
                    yearsExperience: typeof v.yearsExperience === 'number' ? v.yearsExperience : undefined,
                    teamSize: typeof v.teamSize === 'string' ? v.teamSize : undefined,
                    specialties: typeof v.specialties === 'string' ? v.specialties : undefined,
                    createdAt: typeof v.createdAt === 'string' ? v.createdAt : undefined,
                }))
                : [];
            return data;
        } catch (parseError) {
            console.error('Vendor API did not return valid JSON:', text);
            return [];
        }
    } catch (error) {
        console.error('There was a problem fetching the vendor data:', error);
        return [];
    }
};

/**
 * Fetches a single vendor profile by ID from the backend API.
 * @param id The vendor ID to fetch
 * @returns A promise that resolves to a Vendor object or null if not found
 */
export const fetchVendorProfile = async (id: number): Promise<Vendor | null> => {
    try {
        const response = await fetch(`${VENDOR_PROFILE_API_URL}?id=${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        
        const text = await response.text();
        try {
            const vendorData = JSON.parse(text);
            
            // Map the vendor data to match our interface
            const vendor: Vendor = {
                id: vendorData.id || 0,
                vendorName: vendorData.vendorName || '',
                contactPersonName: vendorData.contactPersonName || '',
                category: vendorData.category || '',
                city: vendorData.city || '',
                phone: vendorData.phone || '',
                email: vendorData.email || '',
                websiteUrl: vendorData.websiteUrl || '',
                imageUrl: vendorData.imageUrl,
                description: vendorData.description,
                featured: vendorData.featured || false,
                aboutDescription: vendorData.aboutDescription,
                outdoorPrice: vendorData.outdoorPrice,
                indoorPrice: vendorData.indoorPrice,
                serviceAreas: vendorData.serviceAreas,
                occasions: vendorData.occasions || [],
                galleryImages: vendorData.galleryImages || [],
                socialMedia: vendorData.socialMedia || {},
                contactAddress: vendorData.contactAddress,
                yearsExperience: vendorData.yearsExperience,
                teamSize: vendorData.teamSize,
                specialties: vendorData.specialties,
                createdAt: vendorData.createdAt,
            };
            
            return vendor;
        } catch (parseError) {
            console.error('Vendor profile API did not return valid JSON:', text);
            return null;
        }
    } catch (error) {
        console.error('There was a problem fetching the vendor profile:', error);
        return null;
    }
};