import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const MoviesSearch = () => {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Elokuvan nimi
  const [searchYear, setSearchYear] = useState(""); // Julkaisuvuosi
  const [selectedGenre, setSelectedGenre] = useState(""); // Genre
  const [selectedActor, setSelectedActor] = useState(""); // Näyttelijän nimi
  const [actorId, setActorId] = useState(null); // Näyttelijän ID
  const [genres, setGenres] = useState([]); // Genret listalle
  const [sortByPopularity, setSortByPopularity] = useState(false); // Suosiojärjestys
  const [favoriteMovies, setFavoriteMovies] = useState([]); // Suosikkielokuvat
  const apiKey = "23c2cd5829a1d7db4e98fee32fc45565"; // API-avain

  // Hae genret, kun komponentti ladataan
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

  // Lataa suosikit localStoragesta
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteMovies");
    if (storedFavorites) {
      setFavoriteMovies(JSON.parse(storedFavorites));
    }
  }, []);

  // Päivitä localStorage aina, kun suosikit muuttuvat
  useEffect(() => {
    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
  }, [favoriteMovies]);

  // Hae näyttelijän ID hänen nimellään
  useEffect(() => {
    const fetchActorId = async () => {
      if (!selectedActor.trim()) {
        setActorId(null);
        return;
      }
      try {
        const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&language=fi-FI&query=${encodeURIComponent(selectedActor)}`;
        const response = await axios.get(url);
        const actor = response.data.results[0]; // Käytetään ensimmäistä osumaa
        setActorId(actor ? actor.id : null);
      } catch (error) {
        console.error("Virhe haettaessa näyttelijää:", error);
        setActorId(null);
      }
    };
    fetchActorId();
  }, [selectedActor]);

  // Hae elokuvia hakukriteerien perusteella
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url;

        // Jos hakukysely (nimi) on annettu, käytetään search/movie
        if (searchQuery.trim()) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=fi-FI&query=${encodeURIComponent(searchQuery)}`;
        } else {
          // Muussa tapauksessa käytetään discover/movie
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fi-FI`;
        }

        // Lisää vuosi, jos on annettu
        if (searchYear.trim()) {
          url += `&primary_release_year=${searchYear}`;
        }

        // Lisää genre, jos on valittu
        if (selectedGenre) {
          url += `&with_genres=${selectedGenre}`;
        }

        // Lisää näyttelijän ID, jos se on asetettu
        if (actorId) {
          url += `&with_cast=${actorId}`;
        }

        // Lisää suosiojärjestys, jos se on valittu
        if (sortByPopularity) {
          url += `&sort_by=popularity.asc`; // Vähemmän suosituista ensin
        } else {
          url += `&sort_by=popularity.desc`; // Suosituimmat ensin
        }

        console.log("Rakennettu API URL: ", url); // Debuggausta varten
        const response = await axios.get(url);
        setResults(response.data.results || []);
      } catch (error) {
        console.error("Virhe haettaessa elokuvia:", error);
      }
    };
    fetchMovies();
  }, [searchQuery, searchYear, selectedGenre, actorId, sortByPopularity]);

  // Funktio elokuvan lisäämiseksi suosikkeihin
  const addToFavorites = (movie) => {
    if (!favoriteMovies.some((fav) => fav.id === movie.id)) {
      setFavoriteMovies([...favoriteMovies, movie]);
    }
  };

  // Funktio elokuvan poistamiseksi suosikeista
  const removeFromFavorites = (movieId) => {
    setFavoriteMovies(favoriteMovies.filter((movie) => movie.id !== movieId));
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
          onChange={(e) => setSearchQuery(e.target.value)} // Elokuvan nimen muutos
        />
        <input
          type="number"
          className="search-year"
          placeholder="Julkaisuvuosi (esim. 2020)..."
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)} // Vuoden muutos
        />
        <input
          type="text"
          className="search-actor"
          placeholder="Hae näyttelijän nimellä..."
          value={selectedActor}
          onChange={(e) => setSelectedActor(e.target.value)} // Näyttelijän nimen muutos
        />
        <select
          className="search-genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)} // Genre-valinta
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
            onChange={(e) => setSortByPopularity(e.target.checked)} // Vähemmän suosituista ensin
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
                <p>Suosio: {result.popularity.toFixed(1)}</p>
                <button
                  onClick={() => addToFavorites(result)}
                  disabled={favoriteMovies.some((fav) => fav.id === result.id)} // Estetään, jos elokuva on jo suosikeissa
                >
                  {favoriteMovies.some((fav) => fav.id === result.id) ? "Jo suosikissa" : "Lisää suosikkeihin"}
                </button>
              </div>
            ))
          ) : (
            <p>Ei tuloksia hakukriteereillä</p>
          )}
        </div>
      </div>

      {/* Suosikit */}
      <div className="favorites-container">
        <h2>Suosikit</h2>
        <div className="favorites-grid">
          {favoriteMovies.length > 0 ? (
            favoriteMovies.map((movie) => (
              <div className="favorite-card" key={movie.id}>
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
                <button onClick={() => removeFromFavorites(movie.id)}>Poista suosikeista</button>
              </div>
            ))
          ) : (
            <p>Ei suosikkeja</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesSearch;
