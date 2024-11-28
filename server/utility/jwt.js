import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your_secret_key'; // Use env variable or fallback

// Generate a token
export const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, secretKey, { expiresIn });
};

// Verify a token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        console.error('Token verification failed:', err.message);
        throw new Error('Invalid or expired token');
    }
};