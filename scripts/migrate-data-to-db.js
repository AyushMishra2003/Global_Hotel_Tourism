// Script to migrate existing JSON data to the new database structure
import fs from 'fs';
import path from 'path';
import { pool } from '../backend/config/database.js';

async function migrateData() {
  try {
    console.log('Starting data migration to normalized database...');
    
    // Read hotels_list.json file
    const hotelsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'hotels_list.json'), 'utf8')
    );
    
    // Get a client from the pool
    const client = await pool.connect();
    
    try {
      // Start transaction
      await client.query('BEGIN');
      
      console.log(`Processing ${hotelsData.length} hotels...`);
      
      // Map to track location IDs
      const locationMap = new Map();
      
      // Process each hotel
      for (const hotel of hotelsData) {
        const city = hotel.City || 'Unknown';
        const state = null;  // Assuming state is not available in current data
        const country = 'India';
        
        // Create a unique key for this location
        const locationKey = `${city}-${state || ''}-${country}`;
        
        let locationId;
        
        // Check if we've already processed this location
        if (locationMap.has(locationKey)) {
          locationId = locationMap.get(locationKey);
        } else {
          // Check if location already exists in the database
          const locationResult = await client.query(
            'SELECT id FROM locations WHERE city = $1 AND state IS NOT DISTINCT FROM $2 AND country = $3',
            [city, state, country]
          );
          
          if (locationResult.rows.length > 0) {
            // Location exists, use its ID
            locationId = locationResult.rows[0].id;
          } else {
            // Location doesn't exist, create it
            // Try to find a city image from the 'public/city-images' folder
            const citySlug = city.toLowerCase().replace(/\s+/g, '-');
            const possibleImageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
            let imageUrl = null;
            
            for (const ext of possibleImageExtensions) {
              const imagePath = `/city-images/${citySlug}.${ext}`;
              const fullPath = path.join(process.cwd(), 'public', imagePath);
              
              if (fs.existsSync(fullPath)) {
                imageUrl = imagePath;
                break;
              }
            }
            
            const newLocationResult = await client.query(
              'INSERT INTO locations (city, state, country, image_url) VALUES ($1, $2, $3, $4) RETURNING id',
              [city, state, country, imageUrl]
            );
            
            locationId = newLocationResult.rows[0].id;
            console.log(`Created new location for ${city} with ID ${locationId}`);
          }
          
          // Add to our map
          locationMap.set(locationKey, locationId);
        }
        
        // Insert the hotel with the location ID
        await client.query(
          `INSERT INTO hotels 
            (hotel_name, parent_company, location_id, hero_image, description, official_website) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            hotel['Hotel Name'] || 'Unknown Hotel',
            hotel['Parent Company'] || null,
            locationId,
            hotel['Hero Image'] || null,
            hotel['Description'] || null,
            hotel['Official Website'] || null
          ]
        );
        
        console.log(`Imported hotel: ${hotel['Hotel Name']}`);
      }
      
      // Commit transaction
      await client.query('COMMIT');
      console.log('Data migration completed successfully!');
      
    } catch (err) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      console.error('Error during migration:', err);
      throw err;
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the migration
migrateData();
