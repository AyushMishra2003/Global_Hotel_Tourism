// Database configuration for GHT-2 application
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool
export const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ght_database',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Test database connection
export async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    client.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
}

// Initialize database with necessary tables if they don't exist
export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Check if the locations table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'locations'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Tables do not exist. Please run the schema.sql script to create them.');
      
      // For automatic schema creation, uncomment and use the following:
      // 
      // await client.query(`-- Import schema.sql content here`);
      // console.log('Database schema created successfully');
    } else {
      console.log('Database schema already exists');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
}

// Export a function to close the pool when the app is shutting down
export function closePool() {
  return pool.end();
}
