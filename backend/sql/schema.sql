-- Database Schema for GHT-2 Application

-- Locations Table: Stores unique city, state, country combinations with metadata
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  image_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Create a unique constraint to prevent duplicate locations
  CONSTRAINT unique_location UNIQUE (city, state, country)
);

-- Hotels Table: References locations through a foreign key
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
  -- Foreign key reference to locations table
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE RESTRICT
);

-- Index for faster queries by location
CREATE INDEX idx_hotels_location ON hotels(location_id);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to both tables
CREATE TRIGGER update_locations_timestamp
BEFORE UPDATE ON locations
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_hotels_timestamp
BEFORE UPDATE ON hotels
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- Current Affairs Table: Stores blog posts and articles
CREATE TABLE current_affairs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(255),
  category VARCHAR(100) DEFAULT 'General',
  city VARCHAR(100) DEFAULT 'All Cities',
  author VARCHAR(100) DEFAULT 'Admin',
  excerpt TEXT,
  tags TEXT[], -- Array of tags
  featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_current_affairs_category ON current_affairs(category);
CREATE INDEX idx_current_affairs_city ON current_affairs(city);
CREATE INDEX idx_current_affairs_featured ON current_affairs(featured);

-- Apply the trigger to current_affairs table
CREATE TRIGGER update_current_affairs_timestamp
BEFORE UPDATE ON current_affairs
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();
