import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const categories = [
  'Wedding Ideas',
  'Corporate Events',
  'Destination Weddings',
  'Venue Spotlights'
];

const cities = ['Delhi', 'Jaipur', 'Udaipur', 'Agra', 'Amritsar', 'Shimla', 'Lucknow'];

export default function AddBlog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    city: '',
    author: '',
    content: '',
    tags: ''
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });
    if (selectedImage) {
      formDataToSubmit.append('image', selectedImage);
    }
    console.log('Form submitted:', formData);
    console.log('Image:', selectedImage);
    // Redirect back to inspiration page after submission
    navigate('/inspiration');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f7] via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-[#f0f2f7] border border-[#101c34] text-[#101c34] font-semibold rounded-full px-4 py-2 hover:bg-[#e8ebf3] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-[#d0d6e8]">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Blog</h1>
              <div className="h-1 w-24 bg-gradient-to-r from-[#101c34] to-[#2a3f6b] mx-auto"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label htmlFor="image" className="text-lg font-semibold">Blog Cover Image</Label>
                <div className={cn(
                  "border-2 border-dashed rounded-xl p-6 transition-all",
                  imagePreview ? "border-[#101c34] bg-[#f0f2f7]" : "border-gray-200 hover:border-[#101c34]"
                )}>
                  {!imagePreview ? (
                    <label htmlFor="image" className="flex flex-col items-center gap-2 cursor-pointer">
                      <div className="p-4 rounded-full bg-[#e8ebf3]">
                        <Upload className="w-6 h-6 text-[#101c34]" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Click to upload image</span>
                      <span className="text-xs text-gray-500">PNG, JPG up to 10MB</span>
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-lg">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter blog title"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-lg">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      placeholder="Brief description of your blog"
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-lg">Author Name</Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Enter author name"
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-lg">Category</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-lg">City</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange('city', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city.toLowerCase()}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-lg">Tags</Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="e.g., Wedding, Palace, Royal, Luxury"
                      className="h-12"
                    />
                    <p className="text-xs text-gray-500">Separate tags with commas</p>
                  </div>
                </div>
              </div>

              {/* Full Width Content Editor */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-lg">Blog Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your blog content here..."
                  className="min-h-[300px]"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-8 py-6 h-auto bg-gradient-to-r from-[#101c34] to-[#2a3f6b] hover:bg-[#0d1829]"
                >
                  Publish Blog
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
