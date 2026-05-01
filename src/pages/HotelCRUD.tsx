import React, { useEffect, useState } from 'react';

function HotelCRUD() {
  // For adding new dropdown values
  const [newCity, setNewCity] = useState('');
  const [newParentCompany, setNewParentCompany] = useState('');
  const [newSubBrand, setNewSubBrand] = useState('');
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [uniqueCities, setUniqueCities] = useState([]);
  const [uniqueParentCompanies, setUniqueParentCompanies] = useState([]);
  const [uniqueSubBrands, setUniqueSubBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingHotel, setEditingHotel] = useState(null);
  const [form, setForm] = useState({
    city: '',
    parentCompany: '',
    subBrand: '',
    hotelName: '',
    description: '',
    websiteUrl: '',
    heroImage: ''
  });

  // Fetch hotels from backend
  useEffect(() => {
    async function fetchHotels() {
      setLoading(true);
      try {
        const res = await fetch('/backend/api/get_hotels.php');
        const data = await res.json();
        setHotels(data);
        // Extract unique values for dropdowns
        setUniqueCities([...new Set(data.map(h => h['City']).filter(Boolean))]);
        setUniqueParentCompanies([...new Set(data.map(h => h['Parent Company']).filter(Boolean))]);
        setUniqueSubBrands([...new Set(data.map(h => h['Sub-brand']).filter(Boolean))]);
      } catch (err) {
        setError('Failed to fetch hotels');
      }
      setLoading(false);
    }
    fetchHotels();
  }, []);

  // Handle form input
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle add hotel (dummy, needs backend API)
  function handleAddHotel(e) {
    e.preventDefault();
    fetch('/backend/api/add_hotel.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        window.location.reload();
      })
      .catch(() => alert('Failed to add hotel'));
  }

  // Handle edit hotel (dummy, needs backend API)
  function handleEditHotel(hotel) {
    setEditingHotel(hotel);
    setForm({
      city: hotel['City'] || '',
      parentCompany: hotel['Parent Company'] || '',
      subBrand: hotel['Sub-brand'] || '',
      hotelName: hotel['Hotel Name'] || '',
      description: hotel['Description'] || '',
      websiteUrl: hotel['Official Website'] || '',
      heroImage: hotel['Hero Image'] || ''
    });
  }

  // Handle update hotel (dummy, needs backend API)
  function handleUpdateHotel(e) {
    e.preventDefault();
    fetch('/backend/api/update_hotel.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, id: editingHotel.id })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        window.location.reload();
      })
      .catch(() => alert('Failed to update hotel'));
    setEditingHotel(null);
  }

  // Handle delete hotel (dummy, needs backend API)
  function handleDeleteHotel(id) {
    fetch('/backend/api/delete_hotel.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        window.location.reload();
      })
      .catch(() => alert('Failed to delete hotel'));
  }

  return (
    <div className="hotel-crud-container">
      <h3>Hotels Management</h3>
      <input
        type="text"
        placeholder="Search hotels..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{marginBottom:16, width:'100%', padding:8}}
      />
      {loading ? <p>Loading hotels...</p> : null}
      {error ? <p style={{color:'red'}}>{error}</p> : null}
      <table className="hotel-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>City</th>
            <th>Parent Company</th>
            <th>Sub-brand</th>
            <th>Hotel Name</th>
            <th>Description</th>
            <th>Website</th>
            <th>Hero Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.filter(hotel => {
            const values = Object.values(hotel).join(' ').toLowerCase();
            return values.includes(search.toLowerCase());
          }).map(hotel => (
            editingHotel && editingHotel.id === hotel.id ? (
              <tr key={hotel.id} style={{background:'#f5f5f5'}}>
                <td>{hotel.id}</td>
                <td>
                  <select name="city" value={form.city} onChange={handleChange} required>
                    <option value="">Select city</option>
                    {uniqueCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                    <option value={form.city}>{form.city}</option>
                  </select>
                </td>
                <td>
                  <select name="parentCompany" value={form.parentCompany} onChange={handleChange}>
                    <option value="">Select parent company</option>
                    {uniqueParentCompanies.map(pc => (
                      <option key={pc} value={pc}>{pc}</option>
                    ))}
                    <option value={form.parentCompany}>{form.parentCompany}</option>
                  </select>
                </td>
                <td>
                  <select name="subBrand" value={form.subBrand} onChange={handleChange}>
                    <option value="">Select sub-brand</option>
                    {uniqueSubBrands.map(sb => (
                      <option key={sb} value={sb}>{sb}</option>
                    ))}
                    <option value={form.subBrand}>{form.subBrand}</option>
                  </select>
                </td>
                <td><input name="hotelName" value={form.hotelName} onChange={handleChange} required /></td>
                <td><input name="description" value={form.description} onChange={handleChange} /></td>
                <td><input name="websiteUrl" value={form.websiteUrl} onChange={handleChange} /></td>
                <td><input name="heroImage" value={form.heroImage} onChange={handleChange} /></td>
                <td>
                  <button onClick={handleUpdateHotel}>Save</button>
                  <button type="button" onClick={()=>setEditingHotel(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={hotel.id}>
                <td>{hotel.id}</td>
                <td>{hotel['City']}</td>
                <td>{hotel['Parent Company']}</td>
                <td>{hotel['Sub-brand']}</td>
                <td>{hotel['Hotel Name']}</td>
                <td>{hotel['Description']}</td>
                <td><a href={hotel['Official Website']} target="_blank" rel="noopener noreferrer">Website</a></td>
                <td><img src={hotel['Hero Image']} alt="Hotel" width={60} /></td>
                <td>
                  <button onClick={() => handleEditHotel(hotel)}>Edit</button>
                  <button onClick={() => handleDeleteHotel(hotel.id)}>Delete</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
      <h4>{editingHotel ? 'Edit Hotel' : 'Add Hotel'}</h4>
      <form onSubmit={editingHotel ? handleUpdateHotel : handleAddHotel} className="hotel-form">
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <div>
            <select name="city" value={form.city} onChange={handleChange} required>
              <option value="">Select city</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
              <option value="__add_new_city">Add new...</option>
            </select>
            {form.city === "__add_new_city" && (
              <input
                type="text"
                placeholder="New city"
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                onBlur={() => { setForm(f => ({...f, city: newCity})); setNewCity(''); }}
              />
            )}
          </div>
          <div>
            <select name="parentCompany" value={form.parentCompany} onChange={handleChange}>
              <option value="">Select parent company</option>
              {uniqueParentCompanies.map(pc => (
                <option key={pc} value={pc}>{pc}</option>
              ))}
              <option value="__add_new_parent">Add new...</option>
            </select>
            {form.parentCompany === "__add_new_parent" && (
              <input
                type="text"
                placeholder="New parent company"
                value={newParentCompany}
                onChange={e => setNewParentCompany(e.target.value)}
                onBlur={() => { setForm(f => ({...f, parentCompany: newParentCompany})); setNewParentCompany(''); }}
              />
            )}
          </div>
          <div>
            <select name="subBrand" value={form.subBrand} onChange={handleChange}>
              <option value="">Select sub-brand</option>
              {uniqueSubBrands.map(sb => (
                <option key={sb} value={sb}>{sb}</option>
              ))}
              <option value="__add_new_subbrand">Add new...</option>
            </select>
            {form.subBrand === "__add_new_subbrand" && (
              <input
                type="text"
                placeholder="New sub-brand"
                value={newSubBrand}
                onChange={e => setNewSubBrand(e.target.value)}
                onBlur={() => { setForm(f => ({...f, subBrand: newSubBrand})); setNewSubBrand(''); }}
              />
            )}
          </div>
          <input name="hotelName" value={form.hotelName} onChange={handleChange} placeholder="Hotel Name" required />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <input name="websiteUrl" value={form.websiteUrl} onChange={handleChange} placeholder="Website URL" />
          <input name="heroImage" value={form.heroImage} onChange={handleChange} placeholder="Hero Image URL" />
        </div>
        <button type="submit">{editingHotel ? 'Update' : 'Add'}</button>
        {editingHotel && <button type="button" onClick={()=>setEditingHotel(null)}>Cancel</button>}
      </form>
    </div>
  );
}

export default HotelCRUD;
