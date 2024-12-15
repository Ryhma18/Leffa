import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ToggleSwitch from "./ToggleSwitch"; 
import "./App.css";
import "./styles.css";


import Movies from "./pages/Movies";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import Showtimes from "./pages/Showtimes";
import Register from "./pages/Register";
import Review from "./pages/Review";
import GroupList from "./pages/grouplist";
import CreateGroup from "./pages/creategroup";
import GroupDetails from "./pages/groupdetails";
import ManageRequests from './pages/managerequests';

const Home = () => {
  const [showtimes, setShowtimes] = useState({
    "1014": [], // Pääkaupunkiseutu
    "1012": [], // Espoo
    "1002": [], // Helsinki
    "1018": [], // Oulu
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    fetchShowtimes(today, "1014");
    fetchShowtimes(today, "1012");
    fetchShowtimes(today, "1002");
    fetchShowtimes(today, "1018");

    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Haetaan näytökset Finnkino APIsta
  const fetchShowtimes = async (date, area) => {
    try {
      const formattedDate = new Date(date).toLocaleDateString("fi-FI");
      const response = await fetch(
        `https://www.finnkino.fi/xml/Schedule/?area=${area}&dt=${formattedDate}`
      );
      const text = await response.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");

      const shows = Array.from(xml.getElementsByTagName("Show")).map((show) => {
        const title = show.getElementsByTagName("Title")[0]?.textContent;
        const time = show.getElementsByTagName("dttmShowStartUTC")[0]?.textContent;
        const theatre = show.getElementsByTagName("Theatre")[0]?.textContent;
        const imageUrl = show.getElementsByTagName("ImageUrl")[0]?.textContent || "https://via.placeholder.com/150"; 
        const language =
          show.getElementsByTagName("SpokenLanguage")[0]?.getElementsByTagName("Name")[0]?.textContent || "Ei tietoa";

        return {
          title,
          time,
          theatre,
          imageUrl,
          language,
        };
      });

      setShowtimes((prevShowtimes) => ({
        ...prevShowtimes,
        [area]: shows,
      }));
      setIsLoading(false);
    } catch (error) {
      console.error("Näytöstietojen haku epäonnistui:", error);
      setIsLoading(false);
    }
  };

  
  const getNextShow = (area) => {
    if (!showtimes[area] || showtimes[area].length === 0) return null;

    const currentDateTime = currentTime.toISOString();

    const upcomingShows = showtimes[area]
      .filter((show) => new Date(show.time) > new Date(currentDateTime)) 
      .sort((a, b) => new Date(a.time) - new Date(b.time)); 

    if (upcomingShows.length === 0) return null;

    return upcomingShows[0];
  };

  
  const timeUntilNextShow = (nextShow) => {
    const timeDiff = new Date(nextShow.time) - currentTime;
    return Math.floor(timeDiff / (1000 * 60)); 
  };

  return (
    <div className="home-container">
      <h2>Seuraavat elokuvat</h2>

      <div className="showtimes-container2">
        {isLoading ? (
          <p>Ladataan näytöksiä...</p>
        ) : (
          Object.keys(showtimes).map((area) => {
            const nextShow = getNextShow(area);
            return (
              <div key={area} className="area-showtimes2">
                <h3>{area === "1014" ? "Pääkaupunkiseutu" : area === "1012" ? "Espoo" : area === "1002" ? "Helsinki" : "Oulu"}</h3>
                <div className="showtime-cards2">
                  {nextShow ? (
                    <div className="showtime-card2">
                      <img
                        src={nextShow.imageUrl}
                        alt={nextShow.title}
                        className="showtime-image2"
                      />
                      <div className="showtime-details2">
                        <p><strong>{nextShow.title}</strong></p>
                        <p>Aika: {new Date(nextShow.time).toLocaleTimeString("fi-FI")}</p>
                        <p>Teatteri: {nextShow.theatre}</p>
                        <p>Seuraava elokuva alkaa noin {timeUntilNextShow(nextShow)} minuutin päästä.</p>
                      </div>
                    </div>
                  ) : (
                    <p>Ei tulevia näytöksiä.</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="clock2">
        <p>Nykyinen aika: {currentTime.toLocaleTimeString("fi-FI")}</p>
      </div>
    </div>
  );
};

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
          {/* Hamburger-menu */}
          <div className="hamburger-menu" onClick={toggleMenu}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>

          {/* Navigointivalikko */}
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
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              <button>Profiili</button>
            </Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button>Kirjaudu Sisään</button>
            </Link>
          </nav>

          {/* Tumma tilan kytkin */}
          <ToggleSwitch onToggle={toggleDarkMode} />
        </header>

        {/* Reititykset */}
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
          <Route path="/creategroup" element={<CreateGroup />} />
          <Route path="/managerequests/:groupId" element={<ManageRequests />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
