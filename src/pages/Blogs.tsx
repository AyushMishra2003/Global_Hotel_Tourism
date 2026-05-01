import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const BLOGS_API = 'https://globalhotelsandtourism.com/seo/wp-json/seo/v1/blogs';

export interface WPBlog {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  publish_date?: string | null;
  featured_image?: string;
  category?: string;
  author?: string;
  tags?: string;        // comma-separated string from API
  meta_title?: string;
  meta_description?: string;
  read_time?: string;
  status?: string;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<WPBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(BLOGS_API)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch blogs');
        return res.json();
      })
      .then(data => {
        console.log("data is",data)
        setBlogs(Array.isArray(data) ? data : data.blogs || data.posts || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load blogs. Please try again later.');
        setLoading(false);
      });
  }, []);

  const getImage = (blog: WPBlog) =>
    blog.featured_image || blog.image || blog.thumbnail || '/ght_logo.png';

  const getCategory = (blog: WPBlog) => blog.category || 'Blog';

  const formatDate = (date?: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const handleOpen = (blog: WPBlog) => {
    navigate(`/blogs/${blog.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#101c34] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829]">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-blue-50 overflow-x-hidden pt-6">
      <Button
        onClick={() => navigate('/')}
        className="fixed top-8 left-6 z-50 bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] text-white shadow-md border-0"
        size="sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Hero */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto text-center relative">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
              Our
              <span className="block md:inline bg-gradient-to-r from-[#101c34] to-[#2a3f6b] bg-clip-text text-transparent"> Blog</span>
            </h1>
            <p className="text-base md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Insights, stories, and updates from India's premier hospitality platform.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8ebf3] rounded-full opacity-20 -z-10 hidden md:block" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#e8ebf3] rounded-full opacity-30 -z-10 hidden md:block" />
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-6 md:py-12 px-4">
        <div className="container mx-auto pb-8">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No blogs found</h3>
              <p className="text-gray-500">Check back later for the latest updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {blogs.map(blog => (
                <Card
                  key={blog.id}
                  className="group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm cursor-pointer overflow-hidden flex flex-col"
                  onClick={() => handleOpen(blog)}
                >
                  <div className="relative">
                    <img
                      src={getImage(blog)}
                      alt={blog.title}
                      className="w-full h-40 md:h-48 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/ght_logo.png';
                      }}
                    />
                  </div>
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs bg-[#f0f2f7] text-[#101c34] border-[#b8c0d8]">
                        {getCategory(blog)}
                      </Badge>
                    </div>
                    <CardTitle className="text-base md:text-lg group-hover:text-[#101c34] transition-colors line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    {blog.excerpt && (
                      <CardDescription
                        className="text-xs md:text-sm line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                      />
                    )}
                  </CardHeader>
                  <CardContent className="px-4 pb-4 flex-grow flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mb-3">
                      {blog.author && <span className="truncate">By {blog.author}</span>}
                      {blog.publish_date && (
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          {formatDate(blog.publish_date)}
                        </span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-[#f0f2f7] group-hover:border-[#101c34] text-xs md:text-sm mt-auto">
                      Read Article
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
