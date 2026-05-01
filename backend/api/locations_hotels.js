// Express API routes for hotels and locations

import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/hotels
 * Create a new hotel, automatically handling location creation if needed
 */
router.post('/hotels', authenticateToken, async (req, res) => {
  const { 
    hotel_name,
    parent_company,
    city,
    state = null,
    country = 'India',
    hero_image,
    description,
    official_website,
    address,
    phone,
    email,
    rating
  } = req.body;

  // Validate required fields
  if (!hotel_name || !city || !country) {
    return res.status(400).json({ error: 'Hotel name, city and country are required' });
  }

  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Check if location exists
    let locationResult = await client.query(
      'SELECT id FROM locations WHERE city = $1 AND state IS NOT DISTINCT FROM $2 AND country = $3',
      [city, state, country]
    );
    
    let locationId;
    
    // If location doesn't exist, create it
    if (locationResult.rows.length === 0) {
      const newLocationResult = await client.query(
        'INSERT INTO locations (city, state, country) VALUES ($1, $2, $3) RETURNING id',
        [city, state, country]
      );
      locationId = newLocationResult.rows[0].id;
    } else {
      locationId = locationResult.rows[0].id;
    }
    
    // Insert the hotel with the location ID
    const newHotelResult = await client.query(
      `INSERT INTO hotels 
        (hotel_name, parent_company, location_id, hero_image, description, 
         official_website, address, phone, email, rating) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id`,
      [hotel_name, parent_company, locationId, hero_image, description, 
       official_website, address, phone, email, rating]
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    // Return the created hotel with its ID
    res.status(201).json({
      id: newHotelResult.rows[0].id,
      hotel_name,
      location_id: locationId,
      message: 'Hotel created successfully'
    });
    
  } catch (err) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error creating hotel:', err);
    res.status(500).json({ error: 'Failed to create hotel', details: err.message });
  } finally {
    client.release();
  }
});

/**
 * GET /api/locations
 * Get all locations with their metadata
 */
router.get('/locations', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        l.id, l.city, l.state, l.country, l.image_url, l.description,
        COUNT(h.id) as hotel_count
      FROM locations l
      LEFT JOIN hotels h ON l.id = h.location_id
      GROUP BY l.id
      ORDER BY l.city ASC`
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

/**
 * GET /api/locations/:id
 * Get a specific location with its hotels
 */
router.get('/locations/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get location details
    const locationResult = await pool.query(
      'SELECT * FROM locations WHERE id = $1',
      [id]
    );
    
    if (locationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    // Get hotels for this location
    const hotelsResult = await pool.query(
      'SELECT * FROM hotels WHERE location_id = $1',
      [id]
    );
    
    // Combine results
    res.json({
      ...locationResult.rows[0],
      hotels: hotelsResult.rows
    });
    
  } catch (err) {
    console.error('Error fetching location details:', err);
    res.status(500).json({ error: 'Failed to fetch location details' });
  }
});

/**
 * PATCH /api/locations/:id
 * Update location metadata (admin only)
 */
router.patch('/locations/:id', authenticateToken, async (req, res) => {
  // Check if user has admin privileges
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  
  const { id } = req.params;
  const { city, state, country, image_url, description } = req.body;
  
  try {
    // Build the dynamic update query
    let updateFields = [];
    let queryParams = [];
    let paramCounter = 1;
    
    if (city !== undefined) {
      updateFields.push(`city = $${paramCounter++}`);
      queryParams.push(city);
    }
    
    if (state !== undefined) {
      updateFields.push(`state = $${paramCounter++}`);
      queryParams.push(state);
    }
    
    if (country !== undefined) {
      updateFields.push(`country = $${paramCounter++}`);
      queryParams.push(country);
    }
    
    if (image_url !== undefined) {
      updateFields.push(`image_url = $${paramCounter++}`);
      queryParams.push(image_url);
    }
    
    if (description !== undefined) {
      updateFields.push(`description = $${paramCounter++}`);
      queryParams.push(description);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    // Add the ID to the parameters array
    queryParams.push(id);
    
    // Execute the update
    const result = await pool.query(
      `UPDATE locations 
       SET ${updateFields.join(', ')} 
       WHERE id = $${paramCounter}
       RETURNING *`,
      queryParams
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json({
      message: 'Location updated successfully',
      location: result.rows[0]
    });
    
  } catch (err) {
    console.error('Error updating location:', err);
    res.status(500).json({ error: 'Failed to update location', details: err.message });
  }
});

/**
 * GET /api/hotels
 * Get all hotels with their location data
 */
router.get('/hotels', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        h.id, h.hotel_name, h.parent_company, h.hero_image, 
        h.description, h.official_website, h.address, h.phone, 
        h.email, h.rating, h.created_at, h.updated_at,
        l.city, l.state, l.country, l.image_url as city_image_url
      FROM hotels h
      JOIN locations l ON h.location_id = l.id
      ORDER BY h.hotel_name ASC`
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

export default router;
