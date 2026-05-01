// Current Affairs Data Store
// This file contains all current affairs data and will be updated by the admin panel

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  city: string;
  author: string;
  publishedAt: string;
  readTime: string;
  views: number;
  featured: boolean;
  tags: string[];
  content?: string;
  slug: string;
}

// Utility function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Current Affairs Data - This will be updated dynamically by admin
export const currentAffairsData: BlogPost[] = [
  {
    id: 1,
    title: "Top 10 Wedding Venues in Delhi for 2025",
    excerpt: "Discover the most sought-after wedding venues in Delhi that are perfect for your dream celebration. From luxury hotels to heritage properties...",
    image: "/city-images/delhi.jpg",
    category: "Wedding Ideas",
    city: "Delhi",
    author: "GHT Team",
    publishedAt: "2025-09-15",
    readTime: "8 min read",
    views: 1250,
    featured: true,
    tags: ["wedding", "delhi", "venues", "2025"],
    slug: generateSlug("Top 10 Wedding Venues in Delhi for 2025"),
    content: "Full content will be loaded from markdown files"
  },
  {
    id: 2,
    title: "Corporate Event Planning: A Complete Guide",
    excerpt: "Everything you need to know about planning successful corporate events, from venue selection to catering and entertainment options...",
    image: "/hotel-images/itc-maurya-new-delhi.jpg",
    category: "Corporate Events",
    city: "Delhi",
    author: "Event Specialist",
    publishedAt: "2025-09-14",
    readTime: "12 min read",
    views: 890,
    featured: false,
    tags: ["corporate", "events", "planning"],
    slug: generateSlug("Corporate Event Planning: A Complete Guide"),
    content: "Full content will be loaded from markdown files"
  },
  {
    id: 3,
    title: "Rajasthan's Most Romantic Destination Wedding Locations",
    excerpt: "Explore the royal palaces and heritage hotels of Rajasthan that make for unforgettable destination weddings...",
    image: "/city-images/jaipur.jpg",
    category: "Destination Weddings",
    city: "Jaipur",
    author: "Wedding Planner",
    publishedAt: "2025-09-13",
    readTime: "10 min read",
    views: 2100,
    featured: true,
    tags: ["destination", "wedding", "rajasthan", "royal"],
    slug: generateSlug("Rajasthan's Most Romantic Destination Wedding Locations"),
    content: "Full content will be loaded from markdown files"
  },
  {
    id: 4,
    title: "Spotlight: ITC Mughal Agra - Where Heritage Meets Luxury",
    excerpt: "Take an inside look at one of India's most iconic hotels, known for its Mughal architecture and world-class hospitality...",
    image: "/hotel-images/itc-mughal-agra.jpg",
    category: "Venue Spotlights",
    city: "Agra",
    author: "Hotel Reviewer",
    publishedAt: "2025-09-12",
    readTime: "6 min read",
    views: 1560,
    featured: false,
    tags: ["hotel", "agra", "luxury", "heritage"],
    slug: generateSlug("Spotlight: ITC Mughal Agra - Where Heritage Meets Luxury"),
    content: "Full content will be loaded from markdown files"
  },
  {
    id: 5,
    title: "Trending Wedding Themes for 2025-2026",
    excerpt: "From sustainable celebrations to tech-integrated ceremonies, discover the wedding trends that will dominate the coming seasons...",
    image: "/city-images/udaipur.jpeg",
    category: "Wedding Ideas",
    city: "Udaipur",
    author: "Trend Analyst",
    publishedAt: "2025-09-11",
    readTime: "9 min read",
    views: 1780,
    featured: true,
    tags: ["trends", "wedding", "2025", "themes"],
    slug: generateSlug("Trending Wedding Themes for 2025-2026"),
    content: "Full content will be loaded from markdown files"
  },
  {
    id: 6,
    title: "Goa Beach Resorts: Perfect for Corporate Retreats",
    excerpt: "Why Goa's beach resorts are becoming the top choice for companies planning team building events and corporate retreats...",
    image: "/city-images/goa.jpg",
    category: "Corporate Events",
    city: "Goa",
    author: "Corporate Consultant",
    publishedAt: "2025-09-10",
    readTime: "7 min read",
    views: 920,
    featured: false,
    tags: ["goa", "corporate", "beach", "retreats"],
    slug: generateSlug("Goa Beach Resorts: Perfect for Corporate Retreats"),
    content: "Full content will be loaded from markdown files"
  }
];

// Functions to manage current affairs data
export const getCurrentAffairs = async (): Promise<BlogPost[]> => {
  // Get hardcoded articles
  const staticArticles = [...currentAffairsData];
  
  // Fetch articles from database API
  try {
    const API_URL = import.meta.env.MODE === 'development' 
      ? 'https://globalhotelsandtourism.com/backend/api/current_affairs.php'
      : '/backend/api/current_affairs.php';
    
    console.log('Fetching articles from database API:', API_URL);
    const response = await fetch(API_URL);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        console.log('Database articles fetched:', data.data.length);
        
        // Transform database articles to match BlogPost interface
        const databaseArticles: BlogPost[] = data.data.map((dbArticle: {
              id: number;
              title: string;
              content: string;
              excerpt?: string;
              image_url?: string;
              cover_image_url?: string;
              category?: string;
              city?: string;
              author?: string;
              created_at?: string;
              views?: number;
              featured?: boolean;
              tags?: string;
            }) => ({
              id: dbArticle.id + 1000, // Offset to avoid ID conflicts with static articles
              title: dbArticle.title,
              excerpt: dbArticle.excerpt || dbArticle.content?.substring(0, 150) + '...' || '',
              // Prefer cover_image_url if present (from SQL dump) otherwise fallback to image_url
              image: dbArticle.cover_image_url || dbArticle.image_url || '/placeholder.svg',
              category: dbArticle.category || 'General',
              city: dbArticle.city || 'All Cities',
              author: dbArticle.author || 'Admin',
              publishedAt: dbArticle.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
              readTime: Math.ceil((dbArticle.content?.length || 0) / 200) + ' min read', // Estimate read time based on content length
              views: dbArticle.views || 0,
              featured: dbArticle.featured || false,
              tags: dbArticle.tags ? dbArticle.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
              content: dbArticle.content,
              slug: generateSlug(dbArticle.title)
            }));
        
        // Combine static and database articles
        const allArticles = [...staticArticles, ...databaseArticles];
        console.log('Combined articles:', allArticles.length, 'static:', staticArticles.length, 'database:', databaseArticles.length);
        
        // Sort by publishedAt date (newest first)
        return allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      } else {
        console.log('No database articles found or API error');
      }
    } else {
      console.error('API request failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching database articles:', error);
  }
  
  console.log('Returning only static articles:', staticArticles.length);
  return staticArticles;
};

// Note: addCurrentAffair, updateCurrentAffair, and deleteCurrentAffair functions 
// are no longer needed as we now use the database API through CurrentAffairsManager
// These are kept for backward compatibility if needed in the future

/* DEPRECATED - Use database API instead
export const addCurrentAffair = (newPost: Omit<BlogPost, 'id' | 'slug'>): BlogPost => {
  console.warn('addCurrentAffair is deprecated. Use database API through CurrentAffairsManager instead.');
  throw new Error('This function is deprecated. Use database API instead.');
};
*/

/* DEPRECATED - These functions are no longer needed as we use database API
export const updateCurrentAffair = (id: number, updatedPost: Partial<BlogPost>): BlogPost | null => {
  console.warn('updateCurrentAffair is deprecated. Use database API through CurrentAffairsManager instead.');
  return null;
};

export const deleteCurrentAffair = (id: number): boolean => {
  console.warn('deleteCurrentAffair is deprecated. Use database API through CurrentAffairsManager instead.');
  return false;
};
*/

export const getCategories = async (): Promise<{ name: string; count: number }[]> => {
  const allArticles = await getCurrentAffairs();
  const categories = ['All'];
  const categoryCount: { [key: string]: number } = { 'All': allArticles.length };
  
  allArticles.forEach(post => {
    if (!categories.includes(post.category)) {
      categories.push(post.category);
      categoryCount[post.category] = 0;
    }
    categoryCount[post.category]++;
  });
  
  return categories.map(name => ({ name, count: categoryCount[name] }));
};

export const getCities = async (): Promise<string[]> => {
  const allArticles = await getCurrentAffairs();
  const cities = ['All Cities'];
  allArticles.forEach(post => {
    if (!cities.includes(post.city)) {
      cities.push(post.city);
    }
  });
  return cities;
};