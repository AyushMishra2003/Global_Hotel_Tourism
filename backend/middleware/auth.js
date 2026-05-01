// Authentication middleware for GHT-2 API
import jwt from 'jsonwebtoken';

// Environment variable for JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-for-development';

/**
 * Middleware to authenticate JWT tokens
 */
export function authenticateToken(req, res, next) {
  // Get the authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Add the authenticated user to the request object
    req.user = user;
    next();
  });
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user) {
  // Remove sensitive information
  const { password, ...userDataForToken } = user;
  
  // Generate and return token
  return jwt.sign(
    userDataForToken, 
    JWT_SECRET, 
    { expiresIn: '24h' } // Token expires in 24 hours
  );
}
