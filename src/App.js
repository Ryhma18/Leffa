import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import "./styles.css";

// komponentit pages-kansiosta
import Movies from "./pages/Movies";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import Showtimes from "./pages/Showtimes"; 
import Register from "./pages/Register";
import Review from "./pages/Review";

const Home = () => <h1>Etusivu</h1>;

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* Hamburger Icon */}
          <div className="hamburger-menu" onClick={toggleMenu}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>

          {/* Navigation Bar */}
          <nav className={`horizontal-menu-1 ${menuOpen ? "open" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <button>Etusivu</button>
            </Link>
            <Link to="/movies" onClick={() => setMenuOpen(false)}>
              <button>Elokuvat</button>
            </Link>
            <Link to="/reviews" onClick={() => setMenuOpen(false)}>
              <button>Arvostelut</button>
            </Link>
            <Link to="/showtimes" onClick={() => setMenuOpen(false)}>
              <button>Näytösajat</button>
            </Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              <button>Profiili</button>
            </Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button>Kirjaudu Sisään</button>
            </Link>
          </nav>

          {/* Hakupalkki */}
          <div className="search-container">
            <input
              type="text"
              className="search-1"
              placeholder="Hae elokuvia..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </header>

        {/* Reittien määrittely */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies searchQuery={searchQuery} />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/showtimes" element={<Showtimes />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
