import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const MoviesSearch = () => {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Elokuvan nimi
  const [searchYear, setSearchYear] = useState(""); // Julkaisuvuosi
  const [selectedGenre, setSelectedGenre] = useState(""); // Genre
  const [selectedActor, setSelectedActor] = useState(""); // Näyttelijän nimi
  const [genres, setGenres] = useState([]); // Genret listalle
  const [sortByPopularity, setSortByPopularity] = useState(false); // Suosiojärjestys
  const [suosikit, setSuosikit] = useState([]); // Suosikkielokuvat
  const [elokuva, setElokuva] = useState([]);
  const apiKey = "23c2cd5829a1d7db4e98fee32fc45565"; // API-avain

  
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=fi-FI`;
        const response = await axios.get(url);
        setGenres(response.data.genres || []);
      } catch (error) {
        console.error("Virhe haettaessa genrejä:", error);
      }
    };
    fetchGenres();
  }, []);

  
  useEffect(() => {
    const storedSuosikit = localStorage.getItem("suosikit");
    if (storedSuosikit) {
      setSuosikit(JSON.parse(storedSuosikit));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("suosikit", JSON.stringify(suosikit));
  }, [suosikit]);

  useEffect(() => {
    const storedelokuva = localStorage.getItem("elokuva");
    if (storedelokuva) {
      setSuosikit(JSON.parse(storedelokuva));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("elokuva", JSON.stringify(elokuva));
  }, [elokuva]);

  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url;

        
        if (searchQuery.trim()) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fi-FI&query=${encodeURIComponent(searchQuery)}`;
        } else {
          
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fi-FI`;
        }

        
        if (searchYear.trim()) {
          url += `&primary_release_year=${searchYear}`;
        }

        
        if (selectedGenre) {
          url += `&with_genres=${selectedGenre}`;
        }

        
        if (sortByPopularity) {
          url += `&sort_by=popularity.asc`; 
        } else {
          url += `&sort_by=popularity.desc`;
        }

      
        if (selectedActor.trim()) {
          const actorResponse = await axios.get(
            `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&language=fi-FI&query=${encodeURIComponent(selectedActor)}`
          );

          if (actorResponse.data.results.length > 0) {
            const actorId = actorResponse.data.results[0].id;
            const movieCreditsResponse = await axios.get(
              `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${apiKey}&language=fi-FI`
            );
            const actorMovies = movieCreditsResponse.data.cast;
            setResults(actorMovies); 
            return;
          } else {
            setResults([]);
            return;
          }
        }

     
        const response = await axios.get(url);
        setResults(response.data.results || []);
      } catch (error) {
        console.error("Virhe haettaessa elokuvia:", error);
      }
    };

    fetchMovies();
  }, [searchQuery, searchYear, selectedGenre, sortByPopularity, selectedActor]);

 
  const addToSuosikit = async (movie) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/suosikit",
        {
          movie_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setSuosikit([...suosikit, movie]);
      } else {
        console.log("Elokuva on jo suosikeissa");
      }
    } catch (error) {
      console.error("Virhe lisättäessä suosikkia:", error);
    }
  };

  
  const removeFromSuosikit = async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/suosikit/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuosikit(suosikit.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error("Virhe poistettaessa suosikkia:", error);
    }
  };

  


  const addTogroup = async (movie) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/elokuva",
        {
          movie_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setElokuva([...elokuva, movie]);
      } else {
        console.log("Elokuva on jo ryhmässä");
      }
    } catch (error) {
      console.error("Virhe lisättäessä elokuvaa:", error);
    }
  };


  const removeFromgroup = async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/elokuva/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setElokuva(elokuva.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error("Virhe poistettaessa elokuvaa:", error);
    }
  };

  return (
    <div className="movies-page">
      {/* Hakukentät */}
      <div className="search-container">
        <input
          type="text"
          className="search-1"
          placeholder="Hae elokuvia nimellä... "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <input
          type="number"
          className="search-year"
          placeholder="Julkaisuvuosi (esim. 2020)..."
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)} 
        />
        <input
          type="text"
          className="search-actor"
          placeholder="Hae näyttelijän nimellä..."
          value={selectedActor}
          onChange={(e) => setSelectedActor(e.target.value)} 
        />
        <select
          className="search-genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)} 
        >
          <option value="">Valitse genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <label className="sort-by-popularity">
          <input
            type="checkbox"
            checked={sortByPopularity}
            onChange={(e) => setSortByPopularity(e.target.checked)} 
          />
          Ei niin suositut ensin
        </label>
      </div>

      {/* Tulokset */}
      <div className="results-container">
        <h2>Hakutulokset</h2>
        <div className="results-grid">
          {results.length > 0 ? (
            results.map((result) => (
              <div className="result-card" key={result.id}>
                <img
                  src={
                    result.poster_path
                      ? `https://image.tmdb.org/t/p/w300/${result.poster_path}`
                      : "https://via.placeholder.com/300x450?text=Ei+kuvaa"
                  }
                  alt={result.title}
                />
                <h3>{result.title}</h3>
                <p>Julkaisuvuosi: {result.release_date?.split("-")[0] || "Ei tietoa"}</p>
                <p>Suosio: {result.popularity?.toFixed(1) || "Ei tietoa"}</p>
                <button
                  onClick={() => addToSuosikit(result)}
                  disabled={suosikit.some((fav) => fav.id === result.id)} 
                >
                  {suosikit.some((fav) => fav.id === result.id) ? "Jo suosikissa" : "Lisää suosikkeihin"}
                </button>
                <br></br>
                <br></br>
                <button
                  onClick={() => addTogroup(result)}
                  disabled={elokuva.some((fav) => fav.id === result.id)} 
                >
                  {elokuva.some((fav) => fav.id === result.id) ? "lisätty ryhmään" : "Lisää ryhmään"}
                </button>
              </div>
            ))
          ) : (
            <p>Ei tuloksia hakukriteereillä</p>
          )}
        </div>
      </div>

      {/* Suosikit */}
      <div className="suosikit-container">
        <h2>Suosikit</h2>
        <div className="suosikit-grid">
          {suosikit.length > 0 ? (
            suosikit.map((movie) => (
              <div className="suosikit-card" key={movie.id}>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                      : "https://via.placeholder.com/300x450?text=Ei+kuvaa"
                  }
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
                <p>Julkaisuvuosi: {movie.release_date?.split("-")[0] || "Ei tietoa"}</p>
                <button onClick={() => removeFromSuosikit(movie.id)}>Poista suosikeista</button>
              </div>
            ))
          ) : (
            <p>Ei suosikkeja</p>
          )}
        </div>
      </div>
      <div className="suosikit-container">
        <h2>elokuva</h2>
        <div className="suosikit-grid">
          {elokuva.length > 0 ? (
            elokuva.map((movie) => (
              <div className="suosikit-card" key={movie.id}>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                      : "https://via.placeholder.com/300x450?text=Ei+kuvaa"
                  }
                  alt={movie.title}
                />
                <h3>{movie.title}</h3>
                <p>Julkaisuvuosi: {movie.release_date?.split("-")[0] || "Ei tietoa"}</p>
                <button onClick={() => removeFromgroup(movie.id)}>Poista ryhmästä</button>
              </div>
            ))
          ) : (
            <p>Ei elokuvia</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesSearch;
