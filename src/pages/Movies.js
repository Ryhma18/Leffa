import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; 

const Movies = ({ searchQuery }) => {
  const [movies, setMovies] = useState([]);
  const apiKey = '23c2cd5829a1d7db4e98fee32fc45565'; 

  useEffect(() => {
   
    const fetchMovies = async () => {
      try {
        let url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
        if (searchQuery.trim()) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
            searchQuery
          )}`;
        }
        const response = await axios.get(url);
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [searchQuery]);

  return (
    <div className="movies-container">
      <h2>Elokuvat</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
              alt={movie.title || movie.name}
            />
            <h3>{movie.title || movie.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
