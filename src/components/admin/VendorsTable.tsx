import { useEffect, useState } from 'react';
import React from 'react';

interface Vendor {
  id: number;
  vendorName: string;
  email: string;
  status?: string;
  contactPersonName?: string;
  websiteUrl?: string;
  category?: string;
  city?: string;
  phone?: string;
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
}


export default function VendorsTable() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVendor, setModalVendor] = useState<Vendor|null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/backend/api/get_vendors.php')
      .then(res => res.json())
      .then(data => {
        // Use id as received from backend, do not fallback or infer
        setVendors(Array.isArray(data) ? data : []);
      });
  }, []);

  const openModal = async (vendorId: number) => {
    setModalLoading(true);
    setModalError('');
    setModalOpen(true);
    try {
      const res = await fetch(`/backend/api/get_vendor.php?id=${vendorId}`);
      const data = await res.json();
      if (!data || !data.id) throw new Error('Vendor not found');
      setModalVendor(data);
    } catch (e: unknown) {
      const err = e as Error;
      setModalError(err.message || 'Failed to load vendor');
      setModalVendor(null);
    }
    setModalLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalVendor(null);
    setModalError('');
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!modalVendor) return;
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setModalVendor({ ...modalVendor, [name]: target.checked });
    } else if (type === 'number') {
      setModalVendor({ ...modalVendor, [name]: parseFloat(value) || 0 });
    } else {
      setModalVendor({ ...modalVendor, [name]: value });
    }
  };

  const handleArrayChange = (field: keyof Vendor, index: number, value: string) => {
    if (!modalVendor) return;
    const currentArray = (modalVendor[field] as string[]) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setModalVendor({ ...modalVendor, [field]: newArray });
  };

  const addArrayItem = (field: keyof Vendor) => {
    if (!modalVendor) return;
    const currentArray = (modalVendor[field] as string[]) || [];
    setModalVendor({ ...modalVendor, [field]: [...currentArray, ''] });
  };

  const removeArrayItem = (field: keyof Vendor, index: number) => {
    if (!modalVendor) return;
    const currentArray = (modalVendor[field] as string[]) || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setModalVendor({ ...modalVendor, [field]: newArray });
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    if (!modalVendor) return;
    setModalVendor({ 
      ...modalVendor, 
      socialMedia: { 
        ...modalVendor.socialMedia, 
        [platform]: value 
      } 
    });
  };

  const saveModalVendor = async () => {
    if (!modalVendor) return;
    setSaving(true);
    setModalError('');
    try {
      let url = '/backend/api/update_vendor.php';
      const method = 'POST';
      // If id is 0 or not present, treat as add
      if (!modalVendor.id || modalVendor.id === 0) {
        url = '/backend/api/add_vendor.php';
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalVendor)
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid server response: ' + text);
      }
      if (!data.success) throw new Error(data.error || 'Save failed');
      // Refresh vendors list
      fetch('/backend/api/get_vendors.php')
        .then(res => res.json())
        .then(data => setVendors(Array.isArray(data) ? data : []));
      closeModal();
    } catch (e: unknown) {
      const err = e as Error;
      setModalError(err.message || 'Failed to save vendor');
    }
    setSaving(false);
  };

  const handleDelete = async (vendorEmail: string) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      const res = await fetch(`/backend/api/delete_vendor.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: vendorEmail })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Delete failed');
      setVendors(vendors => vendors.filter(v => v.email !== vendorEmail));
    } catch (e: unknown) {
      const err = e as Error;
      alert(err.message || 'Failed to delete vendor');
    }
  };

  // Filtered, paged, and totalPages must be inside the component
  const filtered = vendors.filter(v =>
    v.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    (v.email && v.email.toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => {
          setModalVendor({
            id: 0,
            vendorName: '',
            email: '',
            status: '',
            contactPersonName: '',
            websiteUrl: '',
            category: '',
            city: '',
            phone: '',
            imageUrl: '',
            description: '',
            featured: false,
            aboutDescription: '',
            outdoorPrice: 0,
            indoorPrice: 0,
            serviceAreas: '',
            occasions: [],
            galleryImages: [],
            socialMedia: {},
            contactAddress: '',
            yearsExperience: 0,
            teamSize: '',
            specialties: ''
          });
          setModalOpen(true);
          setModalError('');
          setModalLoading(false);
        }}>Add Vendor</button>
        <input
          className="border rounded px-3 py-2 w-64"
          placeholder="Search vendors..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      <table className="min-w-full border rounded bg-white">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Featured</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((v, i) => (
            <tr key={v.id ?? i} className="border-t">
              <td className="px-4 py-2">{v.vendorName}</td>
              <td className="px-4 py-2">{v.email}</td>
              <td className="px-4 py-2">
                {v.featured ? (
                  <span className="bg-[#e8ebf3] text-[#101c34] px-2 py-1 rounded-full text-xs font-medium">Featured</span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">Regular</span>
                )}
              </td>
              <td className="px-4 py-2">{v.status || 'Active'}</td>
              <td className="px-4 py-2 space-x-2">
                <button className="text-blue-600 text-xs" onClick={() => openModal(v.id)}>View</button>
                <button className="text-green-600 text-xs" onClick={() => openModal(v.id)}>Edit</button>
                <button className="text-red-600 text-xs" onClick={() => handleDelete(v.email)}>Delete</button>
              </td>
            </tr>
          ))}
          {paged.length === 0 && (
            <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No vendors found.</td></tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-end items-center space-x-2 mt-2">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
      </div>

      {/* Modal for view/edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={closeModal}>&times;</button>
            <h2 className="text-lg font-semibold mb-4">Vendor Details</h2>
            {modalLoading ? (
              <div>Loading...</div>
            ) : modalError ? (
              <div className="text-red-600">{modalError}</div>
            ) : modalVendor ? (
              <form onSubmit={e => { e.preventDefault(); saveModalVendor(); }} className="space-y-4 max-h-96 overflow-y-auto">
                {/* Basic Information */}
                <div className="space-y-3">
                  <h3 className="text-md font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium">Name *</label>
                    <input name="vendorName" value={modalVendor.vendorName} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium">Email *</label>
                    <input name="email" value={modalVendor.email} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" disabled={modalVendor.id !== 0} required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium">Contact Person</label>
                      <input name="contactPersonName" value={modalVendor.contactPersonName || ''} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Phone</label>
                      <input name="phone" value={modalVendor.phone || ''} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium">Category</label>
                      <select name="category" value={modalVendor.category || ''} onChange={handleModalChange} className="border rounded px-2 py-1 w-full">
                        <option value="">Select Category</option>
                        <option value="Event Planners">Event Planners</option>
                        <option value="Caterer">Caterer</option>
                        <option value="Decorator">Decorator</option>
                        <option value="Photography">Photography</option>
                        <option value="Venue">Venue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">City</label>
                      <input name="city" value={modalVendor.city || ''} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium">Website URL</label>
                    <input name="websiteUrl" value={modalVendor.websiteUrl || ''} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea name="description" value={modalVendor.description || ''} onChange={handleModalChange} rows={3} className="border rounded px-2 py-1 w-full" />
                  </div>
                </div>

                {/* Featured Vendor Toggle */}
                <div className="space-y-3">
                  <h3 className="text-md font-medium text-gray-900 border-b pb-2">Featured Vendor</h3>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="featured" 
                      checked={modalVendor.featured || false} 
                      onChange={handleModalChange} 
                      className="rounded"
                    />
                    <label className="text-sm font-medium">Mark as Featured Vendor</label>
                  </div>
                </div>

                {/* Featured Vendor Fields - Only show when featured is true */}
                {modalVendor.featured && (
                  <div className="space-y-3 bg-[#f0f2f7] p-3 rounded">
                    <h4 className="text-sm font-semibold text-[#101c34]">Featured Vendor Details</h4>
                    
                    <div>
                      <label className="block text-sm font-medium">About Description</label>
                      <textarea name="aboutDescription" value={modalVendor.aboutDescription || ''} onChange={handleModalChange} rows={4} className="border rounded px-2 py-1 w-full" placeholder="Detailed company description for featured profile..." />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium">Outdoor Starting Price (₹)</label>
                        <input type="number" name="outdoorPrice" value={modalVendor.outdoorPrice || ''} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Indoor Starting Price (₹)</label>
                        <input type="number" name="indoorPrice" value={modalVendor.indoorPrice || ''} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium">Service Areas</label>
                      <input name="serviceAreas" value={modalVendor.serviceAreas || ''} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" placeholder="Cities/areas served (comma separated)" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium">Contact Address</label>
                      <textarea name="contactAddress" value={modalVendor.contactAddress || ''} onChange={handleModalChange} rows={2} className="border rounded px-2 py-1 w-full" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium">Years of Experience</label>
                        <input type="number" name="yearsExperience" value={modalVendor.yearsExperience || ''} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Team Size</label>
                        <input name="teamSize" value={modalVendor.teamSize || ''} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" placeholder="e.g. 10-20 members" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium">Specialties</label>
                      <textarea name="specialties" value={modalVendor.specialties || ''} onChange={handleModalChange} rows={2} className="border rounded px-2 py-1 w-full" placeholder="Special services and unique selling points..." />
                    </div>
                    
                    {/* Occasions */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Occasions Handled</label>
                      {(modalVendor.occasions || []).map((occasion, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input 
                            value={occasion} 
                            onChange={e => handleArrayChange('occasions', index, e.target.value)}
                            className="border rounded px-2 py-1 flex-1" 
                            placeholder="e.g. Wedding, Reception, Sangeet"
                          />
                          <button type="button" onClick={() => removeArrayItem('occasions', index)} className="text-red-600 px-2">×</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addArrayItem('occasions')} className="text-blue-600 text-sm">+ Add Occasion</button>
                    </div>
                    
                    {/* Gallery Images */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Gallery Images</label>
                      {(modalVendor.galleryImages || []).map((image, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input 
                            value={image} 
                            onChange={e => handleArrayChange('galleryImages', index, e.target.value)}
                            className="border rounded px-2 py-1 flex-1" 
                            placeholder="Image URL"
                          />
                          <button type="button" onClick={() => removeArrayItem('galleryImages', index)} className="text-red-600 px-2">×</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addArrayItem('galleryImages')} className="text-blue-600 text-sm">+ Add Image</button>
                    </div>
                    
                    {/* Social Media */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Social Media</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600">Instagram</label>
                          <input 
                            value={modalVendor.socialMedia?.instagram || ''} 
                            onChange={e => handleSocialMediaChange('instagram', e.target.value)}
                            className="border rounded px-2 py-1 w-full text-sm" 
                            placeholder="Instagram URL"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">Facebook</label>
                          <input 
                            value={modalVendor.socialMedia?.facebook || ''} 
                            onChange={e => handleSocialMediaChange('facebook', e.target.value)}
                            className="border rounded px-2 py-1 w-full text-sm" 
                            placeholder="Facebook URL"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">LinkedIn</label>
                          <input 
                            value={modalVendor.socialMedia?.linkedin || ''} 
                            onChange={e => handleSocialMediaChange('linkedin', e.target.value)}
                            className="border rounded px-2 py-1 w-full text-sm" 
                            placeholder="LinkedIn URL"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">YouTube</label>
                          <input 
                            value={modalVendor.socialMedia?.youtube || ''} 
                            onChange={e => handleSocialMediaChange('youtube', e.target.value)}
                            className="border rounded px-2 py-1 w-full text-sm" 
                            placeholder="YouTube URL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">Logo</label>
                  <div className="relative group w-32 h-32 mb-2">
                    {modalVendor.imageUrl ? (
                      <img
                        src={modalVendor.imageUrl}
                        alt="Vendor Logo"
                        className="w-32 h-32 object-contain border rounded bg-gray-50"
                      />
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center border rounded bg-gray-100 text-gray-400">No image</div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition cursor-pointer">
                      <label htmlFor="vendor-image-upload" className="flex items-center space-x-2 text-white opacity-0 group-hover:opacity-100 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3zm0 0v3a2 2 0 002 2h3" /></svg>
                        <span>Edit</span>
                        <input id="vendor-image-upload" type="file" accept="image/*" className="hidden" onChange={async e => {
                          if (!e.target.files || !e.target.files[0]) return;
                          const formData = new FormData();
                          formData.append('image', e.target.files[0]);
                          formData.append('vendorId', String(modalVendor.id));
                          const res = await fetch('/backend/api/upload_vendor_logo.php', { method: 'POST', body: formData });
                          const data = await res.json();
                          if (data.success && data.imageUrl) setModalVendor(v => v ? { ...v, imageUrl: data.imageUrl } : v);
                        }} />
                      </label>
                      {modalVendor.imageUrl && (
                        <button type="button" className="ml-4 text-white opacity-0 group-hover:opacity-100 transition" title="Delete image" onClick={async () => {
                          if (!window.confirm('Delete this image?')) return;
                          const res = await fetch('/backend/api/delete_vendor_logo.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ vendorId: modalVendor.id })
                          });
                          const data = await res.json();
                          if (data.success) setModalVendor(v => v ? { ...v, imageUrl: '' } : v);
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                  <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={closeModal}>Cancel</button>
                </div>
                {modalError && <div className="text-red-600 mt-2">{modalError}</div>}
              </form>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
