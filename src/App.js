import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import './styles.css';

// Import Movies-komponentti pages-kansiosta
import Movies from './pages/Movies';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Reviews from './pages/Reviews';
import Showtimes from './pages/Showtimes';
import Register from './pages/Register';

const Home = () => <h1>Etusivu</h1>;

function App() {
  // Luodaan tila hakupalkille
  const [searchQuery, setSearchQuery] = useState('');

  // Funktio hakupalkin arvon päivitykseen
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="horizontal-menu-1">
            {/* Linkit sivuille */}
            <Link to="/"><button>Etusivu</button></Link>
            <Link to="/movies"><button>Elokuvat</button></Link>
            <Link to="/reviews"><button>Arvostelut</button></Link>
            <Link to="/showtimes"><button>Näytösajat</button></Link>
            <Link to="/profile"><button>Profiili</button></Link>
            <Link to="/login"><button>Kirjaudu Sisään</button></Link>
          </div>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
