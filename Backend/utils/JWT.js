
import jwt from 'jsonwebtoken';
// Function to generate JWT token
export const generateToken = (userId) => {
  try {
    // Sign the JWT with the user ID and secret key
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return token;
  } catch (error) {
    throw new Error('Error generating token');
  }
};

// Function to verify JWT token
export const verifyToken = (token) => {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // This will return the payload of the JWT token (in this case, user id)
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
