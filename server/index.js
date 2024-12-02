import pkg from 'pg'
import express from 'express'
import cors from 'cors'

const port = 3001

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
        user: 'postgres',
        host: 'localhost',
        database: 'elokuva',
        password: 'root',
        port: 5432
    })
    return pool
}


app.listen(port)