# Database Normalization and API Integration Guide

## Overview

This guide documents the database normalization process for the GHT-2 application, focusing on centralizing hotel and city data management to eliminate redundancy and improve data integrity.

## Database Schema

We've implemented a normalized database structure with two primary tables:

### 1. Locations Table

Stores unique city, state, and country combinations with city-specific metadata:

```sql
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  image_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_location UNIQUE (city, state, country)
);
```

### 2. Hotels Table

Stores hotel information with a foreign key relationship to locations:

```sql
CREATE TABLE hotels (
  id SERIAL PRIMARY KEY,
  hotel_name VARCHAR(255) NOT NULL,
  parent_company VARCHAR(255),
  location_id INT NOT NULL,
  hero_image VARCHAR(255),
  description TEXT,
  official_website VARCHAR(255),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(100),
  rating DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE RESTRICT
);
```

## API Endpoints

### Locations

- **GET /api/locations** - Retrieve all locations with hotel counts
- **GET /api/locations/:id** - Retrieve a specific location with its hotels
- **PATCH /api/locations/:id** - Update location metadata (admin only)

### Hotels

- **GET /api/hotels** - Retrieve all hotels with location data
- **POST /api/hotels** - Create a new hotel (automatically manages locations)

## Frontend Integration

### Data Fetching Utilities

We've created a `locationData.ts` utility file that provides:

- Functions to fetch locations and hotels from the API
- Data transformation between API and legacy formats for backward compatibility
- Helper functions for location slugs and filtering

### Component Updates

Components like `AllCities.tsx` and `PremierDestinations.tsx` have been updated to use the new API endpoints while maintaining backward compatibility with existing code.

## Migration Guide

### Step 1: Database Setup

Run the SQL schema script to create the normalized tables:

```bash
psql -d your_database_name -f backend/sql/schema.sql
```

### Step 2: Data Migration

To migrate existing data:

```bash
# Export data from JSON files
node scripts/migrate-data-to-db.js
```

### Step 3: Update Environment Variables

Create a `.env` file with your database credentials:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ght_database
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

### Step 4: Start the Backend

```bash
npm install
npm run dev:backend
```

## Benefits

1. **Eliminated Data Redundancy**: City data is stored once, regardless of how many hotels reference it
2. **Improved Data Integrity**: Foreign key constraints ensure data consistency
3. **Centralized Management**: City metadata can be updated in one place
4. **Dynamic Frontend**: UI automatically reflects backend data changes

## Next Steps

1. Implement an admin interface for managing locations
2. Add image upload capabilities for location images
3. Create a data migration utility for existing JSON data
4. Enhance search functionality with location filtering
