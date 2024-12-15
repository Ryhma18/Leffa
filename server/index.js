import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import { verifyToken } from './utility/jwt.js';
import { verifyTokenMiddleware } from "./utility/verifyToken.js";

const { Pool } = pkg;
const port = 3001;

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'elokuva',
    password: 'Qwerty123',
    port: 5433,
});


const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connected:', res.rows[0].now);
    } catch (error) {
        console.error('Database connection error:', error.stack);
    }
};
testConnection();


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).send({ message: "Invalid or expired token." });
    }
};


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

        
        if (salasana.trim() !== user.salasana) {
            return res.status(401).send({ error: 'Invalid username or password' });
        }

        
        const token = jwt.sign(
            { id: user.id, käyttäjänimi: user.käyttäjänimi },
            "your_secret_key",
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, userId: user.id });
    } catch (error) {
        console.error('Error during login:', error.stack);
        res.status(500).send({ error: 'Internal server error' });
    }
});


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

app.get('/profile/:userId/favorites', async (req, res) => {
    const { userId } = req.params;
  
    try {
      
      const favorites = await pool.query( 
        'SELECT * FROM suosikit WHERE user_id = $1',
        [userId]
      );
  
      if (favorites.rows.length === 0) {
        return res.status(404).json({ message: 'No favorites found.' });
      }
  
      res.json(favorites.rows);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ message: 'An error occurred' });
    }
});



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
            'INSERT INTO arvostelu (pisteet, elokuva, kuvaus, käyttäjänimi, luomispäivä) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *',
            [pisteet, elokuva, kuvaus, käyttäjänimi]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.delete("/delete", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    try {
        const decoded = verifyToken(token); 

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


app.get('/groups', async (req, res) => {
    try {
        
        const result = await pool.query(
            'SELECT id, nimi, kuvaus, luomispäivä FROM ryhmät'
        ); 

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching groups:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
}); 


app.post('/groups/create', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    try {
        const decoded = verifyToken(token); 
        const { nimi, kuvaus } = req.body;

        if (!nimi || !kuvaus) {
            return res.status(400).json({ error: 'Group name and description are required.' });
        }

       
        const groupResult = await pool.query(
            `INSERT INTO ryhmät (nimi, kuvaus, luomispäivä, creator_id)
             VALUES ($1, $2, CURRENT_DATE, $3) RETURNING id`,
            [nimi, kuvaus, decoded.id]
        );

        const groupId = groupResult.rows[0].id;

        
        await pool.query(
            `INSERT INTO ryhmän_jäsenet (ryhmä_id, käyttäjä_id)
             VALUES ($1, $2)`,
            [groupId, decoded.id]
        );

        res.status(201).json({
            message: 'Group created successfully.',
            group: { id: groupId, nimi, kuvaus },
        });
    } catch (error) {
        console.error('Error creating group:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
}); 


app.post('/groups/join', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    try {
        const decoded = verifyToken(token); 
        const { ryhmä_id } = req.body;

        if (!ryhmä_id) {
            return res.status(400).json({ error: 'Group ID is required.' });
        }

       
        const checkMembership = await pool.query(
            `SELECT * FROM ryhmän_jäsenet WHERE ryhmä_id = $1 AND käyttäjä_id = $2`,
            [ryhmä_id, decoded.id]
        );

        if (checkMembership.rows.length > 0) {
            return res.status(400).json({ error: 'Olet jo tämän ryhmän jäsen.' });
        }

       
        await pool.query(
            `INSERT INTO ryhmän_jäsenet (ryhmä_id, käyttäjä_id) VALUES ($1, $2)`,
            [ryhmä_id, decoded.id]
        );

        res.status(200).json({ message: 'Ryhmään liittyminen onnistui.' });
    } catch (error) {
        console.error('Error joining group:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
}); 

app.get('/groups/mine', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);

        const result = await pool.query(
            `SELECT g.id, g.nimi, g.kuvaus, g.luomispäivä
             FROM ryhmät g
             JOIN ryhmän_jäsenet rj ON g.id = rj.ryhmä_id
             WHERE rj.käyttäjä_id = $1`,
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No groups found for this user.' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching user groups:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/groups/request-join', verifyTokenMiddleware, async (req, res) => {
    const { ryhmä_id } = req.body; 
    const userId = req.user.id; 

    try {
        
        const isMember = await pool.query(
            "SELECT * FROM ryhmän_jäsenet WHERE käyttäjä_id = $1 AND ryhmä_id = $2",
            [userId, ryhmä_id]
        );

        if (isMember.rows.length > 0) {
            return res.status(400).json({ error: "Olet jo tämän ryhmän jäsen." });
        }

        
        const existingRequest = await pool.query(
            "SELECT * FROM join_requests WHERE käyttäjä_id = $1 AND ryhmä_id = $2 AND status = 'pending'",
            [userId, ryhmä_id]
        );

        if (existingRequest.rows.length > 0) {
            return res.status(400).json({ error: "Olet jo lähettänyt liittymispyynnön tähän ryhmään." });
        }

        
        await pool.query(
            "INSERT INTO join_requests (käyttäjä_id, ryhmä_id, status, request_date) VALUES ($1, $2, 'pending', CURRENT_TIMESTAMP)",
            [userId, ryhmä_id]
        );

        res.status(200).json({ message: "Join request sent successfully." });
    } catch (error) {
        console.error("Error creating join request:", error.message);
        res.status(500).json({ error: "Failed to send join request. Please try again." });
    }
}); 

app.get('/groups/requests/:groupId', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);
        const { groupId } = req.params;

        
        const group = await pool.query(`SELECT * FROM ryhmät WHERE id = $1 AND creator_id = $2`, [groupId, decoded.id]);

        if (group.rows.length === 0) {
            return res.status(403).json({ error: 'Et ole tämän ryhmän luoja.' });
        }

        
        const requests = await pool.query(
            `SELECT jr.id, u.käyttäjänimi, u.sähköposti, jr.request_date
             FROM join_requests jr
             JOIN käyttäjä u ON jr.käyttäjä_id = u.id
             WHERE jr.ryhmä_id = $1 AND jr.status = 'pending'`,
            [groupId]
        );

        res.status(200).json(requests.rows);
    } catch (error) {
        console.error('Error fetching join requests:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/groups/requests/respond', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);
        const { requestId, status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be "approved" or "rejected".' });
        }

       
        const request = await pool.query(
            `SELECT jr.*, g.creator_id FROM join_requests jr
             JOIN ryhmät g ON jr.ryhmä_id = g.id
             WHERE jr.id = $1`,
            [requestId]
        );

        if (request.rows.length === 0) {
            return res.status(404).json({ error: 'Liittymispyyntöä ei löytynyt' });
        }

        const { creator_id, ryhmä_id, käyttäjä_id } = request.rows[0];

        if (creator_id !== decoded.id) {
            return res.status(403).json({ error: 'Sinulla ei ole oikeuksia käsitellä tätä pyyntöä' });
        }

       
        await pool.query(`UPDATE join_requests SET status = $1 WHERE id = $2`, [status, requestId]);

      
        if (status === 'approved') {
            await pool.query(`INSERT INTO ryhmän_jäsenet (ryhmä_id, käyttäjä_id) VALUES ($1, $2)`, [ryhmä_id, käyttäjä_id]);
        }

        res.status(200).json({ message: `Request ${status} successfully.` });

    } catch (error) {
        console.error('Error responding to join request:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
}); 

app.get('/groups/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    try {
        const decoded = verifyToken(token); 
        console.log('Decoded Token:', decoded); 

        const { id } = req.params;

       
        const groupResult = await pool.query(`SELECT * FROM ryhmät WHERE id = $1`, [id]);
        if (groupResult.rows.length === 0) {
            return res.status(404).json({ error: 'Group not found.' });
        }

        const group = groupResult.rows[0];
        console.log('Group Details:', group); 

       
        let pendingRequests = [];
        if (parseInt(group.creator_id, 10) === parseInt(decoded.id, 10)) {
            const requestsResult = await pool.query(
                `SELECT jr.id AS request_id, u.käyttäjänimi, u.sähköposti, jr.request_date
                 FROM join_requests jr
                 JOIN käyttäjä u ON jr.käyttäjä_id = u.id
                 WHERE jr.ryhmä_id = $1 AND jr.status = 'pending'`,
                [id]
            );
            pendingRequests = requestsResult.rows;
            console.log('Pending Requests:', pendingRequests); 
        }

        res.status(200).json({ group, pendingRequests });
    } catch (error) {
        console.error('Error fetching group details:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.get('/groups/:groupId/members', async (req, res) => {
    const { groupId } = req.params;

    try {
        const result = await pool.query(
            `SELECT käyttäjä.id, käyttäjä.etunimi, käyttäjä.sukunimi, käyttäjä.käyttäjänimi, käyttäjä.sähköposti
             FROM ryhmän_jäsenet
             JOIN käyttäjä ON ryhmän_jäsenet.käyttäjä_id = käyttäjä.id
             WHERE ryhmän_jäsenet.ryhmä_id = $1`,
            [groupId]
        );


        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching group members:', err.message);
        res.status(500).json({ error: 'Failed to fetch group members' });
    }
});

app.delete('/groups/:groupId/remove-member', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    try {
        const decoded = verifyToken(token);

        
        const groupResult = await pool.query("SELECT * FROM ryhmät WHERE id = $1", [groupId]);
        if (groupResult.rows.length === 0) {
            return res.status(404).json({ error: "Group not found." });
        }

        const group = groupResult.rows[0];
        if (group.creator_id !== decoded.id) {
            return res.status(403).json({ error: "You are not authorized to remove members from this group." });
        }

        
        await pool.query("DELETE FROM ryhmän_jäsenet WHERE käyttäjä_id = $1 AND ryhmä_id = $2", [userId, groupId]);

        res.status(200).json({ message: "Member removed successfully." });
    } catch (error) {
        console.error("Error removing member:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.delete('/groups/:groupId/leave', verifyTokenMiddleware, async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id; 

    try {
        
        const membershipResult = await pool.query(
            "SELECT * FROM ryhmän_jäsenet WHERE käyttäjä_id = $1 AND ryhmä_id = $2",
            [userId, groupId]
        );

        if (membershipResult.rows.length === 0) {
            return res.status(404).json({ error: "Et ole tämän ryhmän jäsen." });
        }

        
        await pool.query(
            "DELETE FROM ryhmän_jäsenet WHERE käyttäjä_id = $1 AND ryhmä_id = $2",
            [userId, groupId]
        );

        res.status(200).json({ message: "Ryhmästä poistuminen onnistui." });
    } catch (error) {
        console.error("Error leaving group:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.delete('/groups/:id', verifyTokenMiddleware, async (req, res) => {
    const { id } = req.params; 
    const userId = req.user.id; 

    try {
        
        const groupResult = await pool.query("SELECT * FROM ryhmät WHERE id = $1", [id]);

        if (groupResult.rows.length === 0) {
            return res.status(404).json({ error: "Group not found." });
        }

        const group = groupResult.rows[0];

        
        if (group.creator_id !== userId) {
            return res.status(403).json({ error: "You are not authorized to delete this group." });
        }

       
        await pool.query("DELETE FROM ryhmät WHERE id = $1", [id]);

        res.status(200).json({ message: "Ryhmän poistaminen onnistui." });
    } catch (error) {
        console.error("Error deleting group:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
}); 





app.get('/suosikit/:userId', verifyTokenMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM suosikit WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No favorites found for this user.' });
    }

   
    const favoriteMovies = result.rows.map((row) => ({
      movie_id: row.movie_id,
      title: row.title,
      poster_path: row.poster_path,
      release_date: row.release_date,
    }));

    
    const favoriteListUrl = `http://localhost:3000/profile/${userId}/favorites`;

    res.status(200).json({
      message: 'Favorites retrieved successfully.',
      data: favoriteMovies,
      shareableUrl: favoriteListUrl,  
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites.' });
  }
});


app.post('/elokuva', authenticateToken, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { movie_id, title, poster_path, release_date } = req.body;

    if (!movie_id || !title) {
        return res.status(400).send({ error: "Missing movie details" });
    }

    try {
        const decoded = verifyToken(token);
        
        
        const groupid = await pool.query(
            'SELECT ryhmä_id FROM ryhmän_jäsenet WHERE käyttäjä_id = $1',
            [decoded.id]
        );

        
        if (groupid.rows.length === 0) {
            return res.status(404).send({ error: "User does not belong to any group" });
        }

        const jtn = groupid.rows[0].ryhmä_id;  

        
        const result = await pool.query(
            `INSERT INTO elokuva (user_id, ryhmä_id, movie_id, title, poster_path, release_date)
             VALUES ($1, $2, $3, $4, $5, $6) 
             ON CONFLICT (user_id, ryhmä_id, movie_id) DO NOTHING 
             RETURNING *`, 
            [req.user.id, jtn, movie_id, title, poster_path, release_date]
        );

        if (result.rowCount === 0) {
            return res.status(200).send({ message: "Movie already in group" });
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding movie:', error.stack);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.get('/elokuva', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT movie_id, title, poster_path, release_date 
             FROM elokuva WHERE user_id = $1`,
            [req.user.id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching movies:', error.stack);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.delete('/elokuva/:movie_id', authenticateToken, async (req, res) => {
    const { movie_id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM elokuva WHERE user_id = $1 AND movie_id = $2`,
            [req.user.id, movie_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send({ message: "Movie not found in group" });
        }

        res.status(200).send({ message: "Movie removed from group" });
    } catch (error) {
        console.error('Error removing movie:', error.stack);
        res.status(500).send({ error: "Internal server error" });
    }
});





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 
 