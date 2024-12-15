import jwt from "jsonwebtoken";

// Secret key for signing the token
const secretKey = "your_secret_key"; // Replace with your actual secret key

// Middleware to verify the token
export const verifyTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

    try {
        const decoded = jwt.verify(token, secretKey); // Verify the token
        req.user = decoded; // Attach the decoded token payload to req.user
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("Error verifying token:", err.message);
        return res.status(401).json({ error: "Unauthorized. Invalid or expired token." });
    }
};
