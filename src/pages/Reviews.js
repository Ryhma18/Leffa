import React, { useEffect, useState } from 'react';
import axios from 'axios';

const url = 'http://localhost:3001/review'

const Reviews = () => {
  const [review,SetReview] = useState ([])

  useEffect (() => {
    axios.get(url)
    .then(response => {
      SetReview(response.data)
    }).catch(error => {
      alert(error.response.data.error ? error.response.data.error : error)
    })
  }, [])

  
  

  return (
    <div>
      <h1>Arvostelut</h1>
      <a href="/review">Tee arvostelu</a>
      <div className="reviews-list">
        <ul>
          {
            review.map((item)=> (
              <li className='review-card '>
                <div className='review-card h2'>Elokuva: {item.elokuva}</div>
                
                <div className='review-card h2'>Pisteet: {item.pisteet}</div>
                
                <div className='review-card h2'>Kuvaus: {item.kuvaus}</div>
                
                <div className='review-card h2'>Käyttäjänimi: {item.käyttäjänimi}</div>
                
                <div className='review-card h2'>Luomispäivä: {new Date(item.luomispäivä).toLocaleDateString()}</div>
                
              </li>
            ))
          }
         
        </ul>


      </div>
      </div>
    
  );
};

export default Reviews;
