import { useEffect, useState, useRef } from 'react';
import React from 'react';

interface Hotel {
  id: number;
  city: string;
  parent_company: string;
  sub_brand: string;
  hotel_name: string;
  description: string;
  website_url: string;
  hero_image_url: string;
}


export default function HotelsTable() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalHotel, setModalHotel] = useState<Hotel|null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [localImageFile, setLocalImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch('/backend/api/get_hotels.php')
      .then(res => res.json())
      .then(data => setHotels(Array.isArray(data) ? data : []));
  }, []);

  const openModal = async (hotelId: number) => {
    setModalLoading(true);
    setModalError('');
    setModalOpen(true);
  setLocalImage(null);
  setLocalImageFile(null);
  setUploadError('');
    try {
      const res = await fetch(`/backend/api/get_hotel.php?id=${hotelId}`);
      const data = await res.json();
      if (!data || !data.id) throw new Error('Hotel not found');
      setModalHotel(data);
    } catch (e: unknown) {
      const err = e as Error;
      setModalError(err.message || 'Failed to load hotel');
      setModalHotel(null);
    }
    setModalLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalHotel(null);
    setModalError('');
  setLocalImage(null);
  setLocalImageFile(null);
  setUploadError('');
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!modalHotel) return;
    setModalHotel({ ...modalHotel, [e.target.name]: e.target.value });
  };

  const saveModalHotel = async () => {
    if (!modalHotel) return;
    setSaving(true);
    setModalError('');
    setUploadError('');
    try {
      let hero_image_url = modalHotel.hero_image_url;
      // If a new image is selected, upload it first
      if (localImageFile) {
        const formData = new FormData();
        formData.append('image', localImageFile);
        formData.append('hotelId', String(modalHotel.id));
        const res = await fetch('/backend/api/upload_hotel_image.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success && data.hero_image_url) {
          hero_image_url = data.hero_image_url;
        } else {
          setUploadError(data.error || 'Image upload failed.');
          setSaving(false);
          return;
        }
      }
      // Now save the hotel with the (possibly new) image URL
      const hotelToSave = { ...modalHotel, hero_image_url };
      const res2 = await fetch(`/backend/api/update_hotel.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotelToSave)
      });
      const data2 = await res2.json();
      if (!data2.success) throw new Error(data2.error || 'Update failed');
      // Refresh hotels list
      fetch('/backend/api/get_hotels.php')
        .then(res => res.json())
        .then(data => setHotels(Array.isArray(data) ? data : []));
      closeModal();
    } catch (e: unknown) {
      const err = e as Error;
      setModalError(err.message || 'Failed to update hotel');
    }
    setSaving(false);
  };

  const handleDelete = async (hotelId: number) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    try {
      const res = await fetch(`/backend/api/delete_hotel.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: hotelId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Delete failed');
      setHotels(hotels => hotels.filter(h => h.id !== hotelId));
    } catch (e: unknown) {
      const err = e as Error;
      alert(err.message || 'Failed to delete hotel');
    }
  };

  // Filtered, paged, and totalPages must be inside the component
  const filtered = hotels.filter(h =>
    (h.hotel_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (h.city ?? '').toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => {
          setModalHotel({
            id: 0,
            hotel_name: '',
            parent_company: '',
            sub_brand: '',
            city: '',
            description: '',
            website_url: '',
            hero_image_url: ''
          });
          setModalOpen(true);
          setModalError('');
          setModalLoading(false);
        }}>Add Hotel</button>
        <input
          className="border rounded px-3 py-2 w-64"
          placeholder="Search hotels..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      <table className="min-w-full border rounded bg-white">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">City</th>
            <th className="px-4 py-2 text-left">Parent Company</th>
            <th className="px-4 py-2 text-left">Sub-brand</th>
            <th className="px-4 py-2 text-left">Hotel Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Website</th>
            <th className="px-4 py-2 text-left">Hero Image</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((h, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{h.id}</td>
              <td className="px-4 py-2">{h.city}</td>
              <td className="px-4 py-2">{h.parent_company}</td>
              <td className="px-4 py-2">{h.sub_brand}</td>
              <td className="px-4 py-2">{h.hotel_name}</td>
              <td className="px-4 py-2">{h.description}</td>
              <td className="px-4 py-2"><a href={h.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{h.website_url}</a></td>
              <td className="px-4 py-2">
                {h.hero_image_url ? <img src={h.hero_image_url} alt="Hero" className="h-12 w-20 object-cover rounded" /> : (
                  // 'No image' fallback commented out as requested
                  // 'No image'
                  null
                )}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button className="text-blue-600 text-xs" onClick={() => openModal(h.id)}>View</button>
                <button className="text-green-600 text-xs" onClick={() => openModal(h.id)}>Edit</button>
                <button className="text-red-600 text-xs" onClick={() => handleDelete(h.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {paged.length === 0 && (
            <tr><td colSpan={9} className="px-4 py-6 text-center text-gray-500">No hotels found.</td></tr>
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={closeModal}>&times;</button>
            <h2 className="text-lg font-semibold mb-4">Hotel Details</h2>
            {modalLoading ? (
              <div>Loading...</div>
            ) : modalError ? (
              <div className="text-red-600">{modalError}</div>
            ) : modalHotel ? (
              <form onSubmit={e => { e.preventDefault(); saveModalHotel(); }} className="space-y-3">
                <div>
                  <label htmlFor="hotel-city" className="block text-sm font-medium">City</label>
                  <input id="hotel-city" name="city" value={modalHotel.city} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" autoComplete="address-level2" />
                </div>
                <div>
                  <label htmlFor="hotel-parent-company" className="block text-sm font-medium">Parent Company</label>
                  <input id="hotel-parent-company" name="parent_company" value={modalHotel.parent_company} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" autoComplete="organization" />
                </div>
                <div>
                  <label htmlFor="hotel-sub-brand" className="block text-sm font-medium">Sub-brand</label>
                  <input id="hotel-sub-brand" name="sub_brand" value={modalHotel.sub_brand} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label htmlFor="hotel-name" className="block text-sm font-medium">Hotel Name</label>
                  <input id="hotel-name" name="hotel_name" value={modalHotel.hotel_name} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" autoComplete="off" />
                </div>
                <div>
                  <label htmlFor="hotel-description" className="block text-sm font-medium">Description</label>
                  <textarea id="hotel-description" name="description" value={modalHotel.description} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label htmlFor="hotel-website-url" className="block text-sm font-medium">Website URL</label>
                  <input id="hotel-website-url" name="website_url" value={modalHotel.website_url} onChange={handleModalChange} className="border rounded px-2 py-1 w-full" autoComplete="url" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hero Image</label>
                  <div className="relative group w-40 h-28 mb-2" aria-label="Hero Image">
                    {localImage ? (
                      <img
                        src={localImage}
                        alt="Preview"
                        className="w-40 h-28 object-cover border-2 border-blue-400 rounded bg-gray-50"
                      />
                    ) : modalHotel.hero_image_url ? (
                      <img
                        src={modalHotel.hero_image_url}
                        alt="Hero"
                        className="w-40 h-28 object-cover border rounded bg-gray-50"
                      />
                    ) : (
                      // <div className="w-40 h-28 flex items-center justify-center border rounded bg-gray-100 text-gray-400">No image</div>
                      null
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition cursor-pointer">
                      <label htmlFor="hotel-image-upload" className="flex items-center space-x-2 text-white opacity-0 group-hover:opacity-100 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3zm0 0v3a2 2 0 002 2h3" /></svg>
                        <span>Edit</span>
                        <input
                          id="hotel-image-upload"
                          name="hero_image_upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={e => {
                            setUploadError('');
                            if (!e.target.files || !e.target.files[0]) return;
                            const file = e.target.files[0];
                            setLocalImageFile(file);
                            const reader = new FileReader();
                            reader.onload = ev => {
                              setLocalImage(ev.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {modalHotel.hero_image_url && (
                        <button type="button" className="ml-4 text-white opacity-0 group-hover:opacity-100 transition" title="Delete image" onClick={async () => {
                          if (!window.confirm('Delete this image?')) return;
                          const res = await fetch('/backend/api/delete_hotel_image.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ hotelId: modalHotel.id })
                          });
                          const data = await res.json();
                          if (data.success) setModalHotel(h => h ? { ...h, hero_image_url: '' } : h);
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 items-center">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                  <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={closeModal}>Cancel</button>
                </div>
                {uploadError && <div className="text-red-600 mt-2">{uploadError}</div>}
                {modalError && <div className="text-red-600 mt-2">{modalError}</div>}
              </form>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
