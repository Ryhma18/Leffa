import pkg from 'pg';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from './utility/jwt.js';
import bcrypt from 'bcrypt';

const port = 3001

login

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

const { Pool } = pkg;

const pool = new Pool ({

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const { Pool} = pkg

app.post('/create',(req,res) => {
    try {
        const pool = openDb()
        const {etunimi,sukunimi,salasana,sähköposti,käyttäjänimi,syntymäpäivä} = req.body
        pool.query('insert into käyttäjä (etunimi,sukunimi,salasana,sähköposti,käyttäjänimi,syntymäpäivä) values ($1,$2,$3,$4,$5,$6) returning *',
            [etunimi,sukunimi,salasana,sähköposti,käyttäjänimi,syntymäpäivä])
        return res.status(200).json({id: result.rows[0].id,etunimi: result.rows[0].etunimi,sukunimi: result.rows[0].sukunimi,salasana: result[0].salasana,sähköposti: result[0].sähköposti,käyttäjänimi: result[0].käyttäjänimi,syntymäpäivä: result[0].syntymäpäivä})
        
    }catch (error){
        return res.status(500).json({error: error.message})
    }
})

app.get('/review', (req,res) => {
    const pool = openDb()
    pool.query('select * from arvostelu',(error, result) => {
        if(error) {
            return res.status(500).json({error: error.message})
        }
        return res.status(200).json(result.rows)
    })
})

app.post('/create/review',(req,res) => {
    try {
        const pool = openDb()
        const {pisteet,elokuva,kuvaus,käyttäjänimi,luomispäivä} = req.body
        pool.query('insert into arvostelu (pisteet,elokuva,kuvaus,käyttäjänimi,luomispäivä) values ($1,$2,$3,$4,$5) returning *',
            [pisteet,elokuva,kuvaus,käyttäjänimi,luomispäivä])
        return res.status(200).json({id: result.rows[0].id,pisteet: result.rows[0].pisteet,elokuva: result.rows[0].elokuva,kuvaus: result.rows[0].kuvaus,käyttäjänimi: result[0].käyttäjänimi,luomispäivä: result[0].luomispäivä})
        
    }catch (error){
        return res.status(500).json({error: error.message})
    }
})



const openDb = () => {
    const pool = new Pool ({
Testi
        user: 'postgres',
        host: 'localhost',
        database: 'elokuva',
        password: 'Spyro0501',
        port: 5432,
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

// Call the function
testConnection();


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

app.get('/', (req, res) => {
  res.send('Working');
});

app.get('/create', (req, res) => {
  res.send('This endpoint is for POST requests only. Use a tool like Postman to send data.');
});

app.get('/delete', (req,res) => {
  res.send('Poisto');
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

app.post('/create', async (req, res) => {
  const { etunimi, sukunimi, salasana, sähköposti, käyttäjänimi, syntymäpäivä } = req.body;

  if (!etunimi || !sukunimi || !salasana || !sähköposti || !käyttäjänimi || !syntymäpäivä) {
      return res.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(salasana, 10);
    const result = await pool.query(
        'INSERT INTO käyttäjä (etunimi, sukunimi, salasana, sähköposti, käyttäjänimi, syntymäpäivä) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [etunimi, sukunimi, salasana, sähköposti, käyttäjänimi, syntymäpäivä]
    );

    res.status(201).send({ success: true, userId: result.rows[0].id });
} catch (error) {
    console.error('Error inserting into database:', error.stack);
    res.status(500).send({ error: 'Internal server error' });
}
});

app.post('/login', async (req, res) => {
  console.log('Request body:', req.body);

  const { käyttäjänimi, salasana } = req.body;

  if (!käyttäjänimi || !salasana) {
      return res.status(400).send({ success: false, message: 'Missing username or password' });
  }

  try {
      const result = await pool.query(
          'SELECT * FROM käyttäjä WHERE käyttäjänimi = $1',
          [käyttäjänimi]
      );

      console.log('Database query result:', result.rows);

      if (result.rows.length === 0) {
          return res.status(401).send({ success: false, message: 'Invalid username or password' });
      }

      const user = result.rows[0];
      console.log('Input password:', `"${salasana}"`, 'Length:', salasana.length);
      console.log('Stored password:', `"${user.salasana}"`, 'Length:', user.salasana.length);

      
      const isPasswordValid =  salasana.trim() === user.salasana.trim(); // Use bcrypt.compare() if passwords are hashed
      console.log('Password match:', isPasswordValid);

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

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});

export default pool;