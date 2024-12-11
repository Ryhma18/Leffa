import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import { verifyToken } from './utility/jwt.js'; // Tämä oletetaan olevan jossain

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

// Test route
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
        const result = await pool.query(
            'INSERT INTO käyttäjä (etunimi, sukunimi, salasana, sähköposti, käyttäjänimi, syntymäpäivä) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [etunimi, sukunimi, salasana, sähköposti, käyttäjänimi, syntymäpäivä]
        );
        res.status(201).json({
            id: result.rows[0].id,
            etunimi: result.rows[0].etunimi,
            sähköposti: result.rows[0].sähköposti,
            käyttäjänimi: result.rows[0].käyttäjänimi,
        });
    } catch (error) {
        console.error('Error inserting into database:', error.stack);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { käyttäjänimi, salasana } = req.body;

    if (!käyttäjänimi || !salasana) {
        return res.status(400).send({ error: 'Missing username or password' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM käyttäjä WHERE LOWER(käyttäjänimi) = LOWER($1)',
            [käyttäjänimi]
        );

        if (result.rows.length === 0) {
            return res.status(401).send({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // Check password directly without bcrypt (using plain text comparison)
        if (salasana.trim() !== user.salasana) {
            return res.status(401).send({ error: 'Invalid username or password' });
        }

        // Generate a token using JWT
        const token = jwt.sign(
            { id: user.id, käyttäjänimi: user.käyttäjänimi },
            "your_secret_key",
            { expiresIn: "1h" }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error.stack);
        res.status(500).send({ error: 'Internal server error' });
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

// Favorites routes
app.post('/suosikit', authenticateToken, async (req, res) => {
    const { movie_id, title, poster_path, release_date } = req.body;

    if (!movie_id || !title) {
        return res.status(400).send({ error: "Missing movie details" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO suosikit (user_id, movie_id, title, poster_path, release_date)
             VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id, movie_id) DO NOTHING RETURNING *`,
            [req.user.id, movie_id, title, poster_path, release_date]
        );

        if (result.rowCount === 0) {
            return res.status(200).send({ message: "Movie already in suosikit" });
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding suosikit:', error.stack);
        res.status(500).send({ error: "Internal server error" });
    }
});

// Fetch user favorites
app.get('/suosikit', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT movie_id, title, poster_path, release_date 
             FROM suosikit WHERE user_id = $1`,
            [req.user.id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching suosikit:', error.stack);
        res.status(500).send({ error: "Internal server error" });
    }
});

// Delete favorite movie
app.delete('/suosikit/:movie_id', authenticateToken, async (req, res) => {
    const { movie_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM suosikit WHERE user_id = $1 AND movie_id = $2`,
            [req.user.id, movie_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({ message: "Movie not found in suosikit" });
        }

        res.status(200).send({ message: "Movie removed from suosikit" });
    } catch (error) {
        console.error('Error removing suosikit:', error.stack);
        res.status(500).send({ error: "Internal server error" });
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


// Delete user account
app.delete("/delete", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    try {
        const decoded = verifyToken(token); // Decode the token to get the user's ID

        const result = await pool.query(
            "DELETE FROM käyttäjä WHERE id = $1 RETURNING *",
            [decoded.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "User account deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
