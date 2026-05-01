import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, BookOpen, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import type { WPBlog } from './Blogs';

const BLOGS_API = 'https://globalhotelsandtourism.com/seo/wp-json/seo/v1/blogs';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<WPBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    // Fetch all blogs and find the one matching the slug
    fetch(BLOGS_API)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: WPBlog[]) => {
        const list = Array.isArray(data) ? data : [];
        const post = list.find(b => b.slug === slug) || null;
        if (!post) throw new Error('Blog not found');
        setBlog(post);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unable to load blog.');
        setLoading(false);
      });
  }, [slug]);

  const getImage = (b: WPBlog) => b.featured_image || '/ght_logo.png';

  const getCategory = (b: WPBlog) => b.category || 'Blog';

  // tags is a comma-separated string from the API
  const getTags = (b: WPBlog): string[] =>
    b.tags ? b.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  const formatDate = (date?: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#101c34] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => navigate('/blogs')}
            className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-blue-50">
      {/* Sticky top bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => navigate('/blogs')}
            variant="ghost"
            className="hover:bg-[#f0f2f7]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={getImage(blog)}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/ght_logo.png'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className="bg-[#f0f2f7] text-[#101c34] border-[#b8c0d8]">
              {getCategory(blog)}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p
              className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.excerpt }}
            />
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 pb-6 border-b border-gray-200">
            {blog.author && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-[#101c34] to-[#2a3f6b] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {blog.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{blog.author}</p>
                  <p className="text-xs text-gray-500">Author</p>
                </div>
              </div>
            )}
            {blog.publish_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.publish_date)}</span>
              </div>
            )}
          </div>
        </header>

        {/* Content — plain text with paragraph breaks */}
        {blog.content && (
          <div className="prose prose-lg prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-[#101c34] hover:prose-a:text-[#101c34] max-w-none mb-8">
            {blog.content.split(/\r?\n\r?\n/).map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
          </div>
        )}

        {/* Tags */}
        {getTags(blog).length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {getTags(blog).map(tag => (
                <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="text-center mt-12 mb-4">
          <Button
            onClick={() => navigate('/blogs')}
            className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829] px-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Blogs
          </Button>
        </div>
      </article>
      <Footer />
    </div>
  );
}
