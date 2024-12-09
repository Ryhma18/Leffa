import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pkg from 'pg';
import { generateToken, verifyToken } from './utility/jwt.js';

const { Pool } = pkg;
const port = 3001;

// Initialize Express app
const app = express();

// Use middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize PostgreSQL Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'elokuva',
    password: 'Qwerty123',
    port: 5433,
});

// Test database connection
const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connected:', res.rows[0].now);
    } catch (error) {
        console.error('Database connection error:', error.stack);
    }
};
testConnection();

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
        req.user = decoded; // Attach decoded user data to request
        next();
    } catch (error) {
        return res.status(403).send({ message: "Invalid or expired token." });
    }
};

// Routes
app.get('/', (req, res) => {
    res.send('Working');
});

// User registration
app.post('/create', async (req, res) => {
    const { etunimi, sukunimi, salasana, sähköposti, käyttäjänimi, syntymäpäivä } = req.body;

    if (!etunimi || !sukunimi || !salasana || !sähköposti || !käyttäjänimi || !syntymäpäivä) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(salasana, 10);
        const result = await pool.query(
            'INSERT INTO käyttäjä (etunimi, sukunimi, salasana, sähköposti, käyttäjänimi, syntymäpäivä) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [etunimi, sukunimi, hashedPassword, sähköposti, käyttäjänimi, syntymäpäivä]
        );
        res.status(201).send({ success: true, userId: result.rows[0].id });
    } catch (error) {
        console.error('Error inserting into database:', error.stack);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { käyttäjänimi, salasana } = req.body;

    if (!käyttäjänimi || !salasana) {
        return res.status(400).send({ success: false, message: 'Missing username or password' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM käyttäjä WHERE käyttäjänimi = $1',
            [käyttäjänimi]
        );

        if (result.rows.length === 0) {
            return res.status(401).send({ success: false, message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(salasana, user.salasana); // Compare hashed password

        if (!isPasswordValid) {
            return res.status(401).send({ success: false, message: 'Invalid username or password' });
        }

        // Generate a token using JWT
        const token = generateToken({ id: user.id, käyttäjänimi: user.käyttäjänimi });

        res.status(200).send({
            success: true,
            message: 'Login successful',
            token,
        });
    } catch (error) {
        console.error('Error during login:', error.stack);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

// Review routes
app.get('/review', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM arvostelu');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/create/review', async (req, res) => {
    const { pisteet, elokuva, kuvaus, käyttäjänimi, luomispäivä } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO arvostelu (pisteet, elokuva, kuvaus, käyttäjänimi, luomispäivä) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [pisteet, elokuva, kuvaus, käyttäjänimi, luomispäivä]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Profile route (only accessible with token)
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT etunimi, sukunimi, sähköposti, käyttäjänimi FROM käyttäjä WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send({ message: "User not found." });
        }

        res.status(200).send(result.rows[0]);
    } catch (error) {
        console.error("Error fetching profile:", error.stack);
        res.status(500).send({ message: "Internal server error." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
