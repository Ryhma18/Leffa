import React from 'react';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      movieTitle: "Elokuva 1",
      reviewText: "Tämä elokuva oli todella hyvä! Nautin siitä kovasti.",
      rating: 4, // Arvio 1-5
      user: "Matti"
    },
    {
      id: 2,
      movieTitle: "Elokuva 2",
      reviewText: "Ei ollut ihan odotusten mukainen, mutta viihdyttävä kuitenkin.",
      rating: 3,
      user: "Liisa"
    },
    {
      id: 3,
      movieTitle: "Elokuva 3",
      reviewText: "Fantastinen elokuva! Erinomaiset näyttelijäsuoritukset.",
      rating: 5,
      user: "Pekka"
    }
  ];

  return (
    <div>
      <h1>Arvostelut</h1>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h2>{review.movieTitle}</h2>
            <p><strong>Arvostelu:</strong> {review.reviewText}</p>
            <p><strong>Arvio:</strong> {review.rating} / 5</p>
            <p><strong>Käyttäjä:</strong> {review.user}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
