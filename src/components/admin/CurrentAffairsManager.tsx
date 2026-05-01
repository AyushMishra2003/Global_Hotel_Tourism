import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Image, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageUpload from '@/components/ui/ImageUpload';

interface CurrentAffair {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  category: string;
  city: string;
  author: string;
  created_at: string;
  views: number;
  featured: boolean;
  tags?: string;
}

interface FormData {
  title: string;
  content: string;
  image_url: string;
  category: string;
  city: string;
  featured: boolean;
  tags: string;
}

const CurrentAffairsManager = () => {
  const [affairs, setAffairs] = useState<CurrentAffair[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    image_url: '',
    category: 'General',
    city: 'All Cities',
    featured: false,
    tags: ''
  });

  const API_URL = import.meta.env.MODE === 'development' 
    ? 'https://globalhotelsandtourism.com/backend/api/current_affairs.php'
    : '/backend/api/current_affairs.php';

  const categories = ['General', 'Wedding Ideas', 'Corporate Events', 'Destination Weddings', 'Venue Spotlights'];
  const cities = ['All Cities', 'Delhi', 'Jaipur', 'Udaipur', 'Agra', 'Amritsar', 'Mumbai', 'Goa'];

  const fetchAffairs = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        setAffairs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch current affairs:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchAffairs();
  }, [fetchAffairs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const payload = editingId ? { ...formData, id: editingId } : formData;

      const response = await fetch(API_URL, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAffairs();
        resetForm();
        
        // Notify other components that data has changed
        window.dispatchEvent(new CustomEvent('currentAffairsUpdated'));
        
        alert(editingId ? 'Current affair updated successfully!' : 'Current affair created successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving current affair:', error);
      alert('Failed to save current affair');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (affair: CurrentAffair) => {
    setFormData({
      title: affair.title,
      content: affair.content,
      image_url: affair.image_url || '',
      category: affair.category,
      city: affair.city,
      featured: affair.featured,
      tags: affair.tags || ''
    });
    setEditingId(affair.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this current affair?')) return;

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAffairs();
        
        // Notify other components that data has changed
        window.dispatchEvent(new CustomEvent('currentAffairsUpdated'));
        
        alert('Current affair deleted successfully!');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting current affair:', error);
      alert('Failed to delete current affair');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image_url: '',
      category: 'General',
      city: 'All Cities',
      featured: false,
      tags: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading && affairs.length === 0) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Current Affairs Management</h2>
        <Button onClick={() => setShowForm(true)} className="bg-[#101c34] hover:bg-[#101c34]">
          <Plus className="w-4 h-4 mr-2" />
          Add Current Affair
        </Button>
      </div>

      {/* Current Affairs List */}
      <div className="grid gap-4">
        {affairs.map((affair) => (
          <Card key={affair.id} className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-lg">{affair.title}</CardTitle>
                <CardDescription className="mt-1">
                  {affair.category} • {affair.city} • {affair.views} views
                  {affair.featured && <span className="ml-2 text-[#101c34] font-medium">Featured</span>}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(affair)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(affair.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2">{affair.excerpt}</p>
              {affair.image_url && (
                <div className="mt-2">
                  <img src={affair.image_url} alt={affair.title} className="w-20 h-20 object-cover rounded" />
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Created: {new Date(affair.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Current Affair' : 'Add New Current Affair'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter title"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-1">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter content"
                required
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#101c34] focus:border-[#101c34]"
              />
            </div>

            {/* Image Upload */}
            <ImageUpload
              onImageUploaded={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
              currentImage={formData.image_url}
            />

            {/* Category and City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#101c34]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#101c34]"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Enter tags separated by commas (e.g., tourism, delhi, hotels)"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
            </div>

            {/* Featured */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="featured" className="text-sm font-medium">Mark as Featured</label>
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-[#101c34] hover:bg-[#101c34]">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurrentAffairsManager;