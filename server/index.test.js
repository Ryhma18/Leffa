import { expect } from "chai";


 login
describe('POST task',() => {
    it ('should post a task',async() => {
        const response = await fetch('http://localhost:3001/create',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'etunimi':'test',
                'sukunimi':'test',
                'salasana':'wataa',
                'sähköposti':'jtn@emt.fi',
                'käyttäjänimi':'wataa',
                'syntymäpäivä':'13.3.1337'
            })
        });

        const data = await response.json();


        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id');

    })
})

describe('POST käyttäjä',() => {
    it ('should post a käyttäjä',async() => {
        const response = await fetch('http://localhost:3001/create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'etunimi':'test','sukunimi':'test','salasana':'testi','sähköposti':'jtn@emt.fi','käyttäjänimi':'testi','syntymäpäivä':'13.3.1337'})
        })
        const data = await response.json()
        console.log(data)
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
Testi
    })
})

describe('GET arvostelu',() => {
    it ('should get all arvostelut',async() => {
        const response = await fetch('http://localhost:3001/review')
        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys('id','pisteet','elokuva','kuvaus','käyttäjänimi','luomispäivä')
    })
})

describe('POST arvostelu',() => {
    it ('should post a arvostelu',async() => {
        const response = await fetch('http://localhost:3001/create/review',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'pisteet':'5','elokuva':'Venom','kuvaus':'ihan ookoo','käyttäjänimi':'testi','luomispäivä':'2.12.2024'})
        })
        const data = await response.json()
        console.log(data)
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })
})