import { expect } from "chai";


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