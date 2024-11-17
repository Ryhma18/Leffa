// pages/Movies.js
import React from 'react';

const Movies = () => {
  const movies = [
    {
      id: 1,
      title: "Elokuva 1",
      description: "Tämä on elokuvan 1 kuvaus.",
      image: "https://via.placeholder.com/150" // Esimerkki kuva
    },
    {
      id: 2,
      title: "Elokuva 2",
      description: "Tämä on elokuvan 2 kuvaus.",
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      title: "Elokuva 3",
      description: "Tämä on elokuvan 3 kuvaus.",
      image: "https://via.placeholder.com/150"
    }
  ];

  return (
    <div>
      <h1>Elokuvat</h1>
      <div className="movies-list">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img src={movie.image} alt={movie.title} />
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
