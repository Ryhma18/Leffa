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