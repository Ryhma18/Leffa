import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Switch } from "react-router-dom";
import ToggleSwitch from "./ToggleSwitch"; // Import the ToggleSwitch component
import "./App.css";
import "./styles.css";

// Other components
import Movies from "./pages/Movies";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import Showtimes from "./pages/Showtimes"; 
import Register from "./pages/Register";
import Review from "./pages/Review";
import GroupList from "./pages/grouplist";
import Groups from "./pages/groups";
import CreateGroup from "./pages/creategroup";

const Home = () => <h1>Etusivu</h1>;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); 

  const toggleDarkMode = (newState) => {
    setDarkMode(newState);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

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
            <Link to="/grouplist" onClick={() => setMenuOpen(false)}>
            <button>Ryhmälista</button>
            </Link>
            <Link to="/groups" onClick={() => setMenuOpen(false)}>
            <button>Omat Ryhmät</button>
            </Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              <button>Profiili</button>
            </Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button>Kirjaudu Sisään</button>
            </Link>
          </nav>

          {/* Dark Mode Toggle Button */}
          <ToggleSwitch onToggle={toggleDarkMode} />
        </header>

        {/* Reittien määrittely */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/showtimes" element={<Showtimes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/review" element={<Review />} />
          <Route path="/grouplist" element={<GroupList />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/create-group" element={<CreateGroup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
