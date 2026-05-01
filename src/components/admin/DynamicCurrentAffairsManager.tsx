import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/ui/ImageUpload';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Edit3, Plus, Calendar, Eye, Tag } from 'lucide-react';
import { 
  getCurrentAffairs,
  type BlogPost 
} from '@/data/currentAffairsData';

interface CurrentAffairForm {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  city: string;
  author: string;
  readTime: string;
  featured: boolean;
  tags: string;
  content: string;
}

const DynamicCurrentAffairsManager: React.FC = () => {
  const [currentAffairs, setCurrentAffairs] = useState<BlogPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAffair, setEditingAffair] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<CurrentAffairForm>({
    title: '',
    excerpt: '',
    image: '',
    category: '',
    city: '',
    author: 'Admin',
    readTime: '5 min read',
    featured: false,
    tags: '',
    content: ''
  });

  // Load current affairs on component mount
  useEffect(() => {
    loadCurrentAffairs();
  }, []);

  const loadCurrentAffairs = async () => {
    try {
      const affairs = await getCurrentAffairs();
      setCurrentAffairs(affairs);
    } catch (error) {
      console.error('Error loading current affairs:', error);
      setCurrentAffairs([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const publishedAt = new Date().toISOString().split('T')[0];
      const views = Math.floor(Math.random() * 1000) + 100;

      const affairData = {
        title: formData.title,
        excerpt: formData.excerpt,
        image: formData.image || '/placeholder.svg',
        category: formData.category,
        city: formData.city,
        author: formData.author,
        publishedAt,
        readTime: formData.readTime,
        views,
        featured: formData.featured,
        tags: tagsArray,
        content: formData.content
      };

      if (editingAffair) {
        // Update existing - Note: Use database API through CurrentAffairsManager instead
        console.warn('Update functionality moved to database API');
      } else {
        // Add new - Note: Use database API through CurrentAffairsManager instead
        console.warn('Add functionality moved to database API');
        
        // Create markdown file for the content
        await createBlogFile(affairData.title, formData.content);
      }

      // Notify other components that data has changed
      window.dispatchEvent(new CustomEvent('currentAffairsUpdated'));
      
      loadCurrentAffairs();
      resetForm();
      setIsDialogOpen(false);
      
    } catch (error) {
      console.error('Error saving current affair:', error);
      alert('Error saving current affair. Please try again.');
    }
  };

  const createBlogFile = async (title: string, content: string) => {
    // In a real application, this would save to a file system
    // For now, we'll store in localStorage as a fallback
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    localStorage.setItem(`blog_${slug}`, content);
  };

  const handleEdit = (affair: BlogPost) => {
    setEditingAffair(affair);
    setFormData({
      title: affair.title,
      excerpt: affair.excerpt,
      image: affair.image,
      category: affair.category,
      city: affair.city,
      author: affair.author,
      readTime: affair.readTime,
      featured: affair.featured,
      tags: affair.tags.join(', '),
      content: affair.content || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this current affair?')) {
      // Delete functionality moved to database API
      console.warn('Delete functionality moved to database API');
      window.dispatchEvent(new CustomEvent('currentAffairsUpdated'));
      loadCurrentAffairs();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      image: '',
      category: '',
      city: '',
      author: 'Admin',
      readTime: '5 min read',
      featured: false,
      tags: '',
      content: ''
    });
    setEditingAffair(null);
  };

  const categories = ['Wedding Ideas', 'Corporate Events', 'Destination Weddings', 'Venue Spotlights', 'General'];
  const cities = ['Delhi', 'Mumbai', 'Jaipur', 'Agra', 'Udaipur', 'Goa', 'Bangalore', 'Chennai'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manage Current Affairs</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Current Affair
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAffair ? 'Edit Current Affair' : 'Add New Current Affair'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Enter brief excerpt..."
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#101c34] focus:border-[#101c34]"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#101c34] focus:border-[#101c34]"
                    required
                  >
                    <option value="">Select city</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 min read"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <ImageUpload
                    onImageUploaded={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                    currentImage={formData.image}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., wedding, delhi, venues"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-[#101c34] bg-gray-100 border-gray-300 rounded focus:ring-[#101c34]"
                />
                <Label htmlFor="featured">Featured Article</Label>
              </div>

              <div>
                <Label htmlFor="content">Full Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter the full article content in markdown format..."
                  rows={10}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829]"
                >
                  {editingAffair ? 'Update' : 'Add'} Current Affair
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentAffairs.map((affair) => (
          <Card key={affair.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={affair.image}
                alt={affair.title}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              {affair.featured && (
                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-[#101c34] to-[#2a3f6b]">
                  Featured
                </Badge>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{affair.category}</Badge>
                <Badge variant="outline">{affair.city}</Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">{affair.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{affair.excerpt}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(affair.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {affair.views}
                  </span>
                </div>
                <span>{affair.readTime}</span>
              </div>

              <div className="flex gap-1 mb-4 flex-wrap">
                {affair.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(affair)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(affair.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentAffairs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Current Affairs</h3>
          <p className="text-gray-500">Start by adding your first current affair.</p>
        </div>
      )}
    </div>
  );
};

export default DynamicCurrentAffairsManager;