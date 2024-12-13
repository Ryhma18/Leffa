import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import axios from 'axios'; // Import axios

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]); // Tila suosikeille
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const closePopup = () => {
    setShowPopup(false);
    window.location.href = '/login'; // Redirect to login
  };

  // Hae profiilin tiedot
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token'); // Get token

      if (!token) {
        setShowPopup(true);
        return;
      }

      try {
        console.log('Fetching profile...');
        const response = await axios.get('http://localhost:3001/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token
          },
        });
        console.log('Profile data:', response.data);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
        localStorage.removeItem('token'); // Clear invalid token
        window.location.href = '/login'; // Redirect to login
        setShowPopup(true);
      }
    };

    fetchProfile();
  }, []);

  // Hae suosikit palvelimelta
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token'); // Get token

      if (!token) {
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/suosikit', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token
          },
        });
        setFavoriteMovies(response.data);
      } catch (error) {
        console.error('Error fetching favorite movies:', error.response?.data || error.message);
      }
    };

    fetchFavorites();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    window.location.href = '/login'; // Redirect to login page
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Tokenia ei löydy, ole hyvä ja kirjaudu sisään uudelleen');
      window.location.href = '/login';
      return;
    }

    const confirmDelete = window.confirm(
      'Oletko varma että haluat poistaa käyttäjän? Poistamista ei voi kumota.'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      console.log('Sending delete request with token:', token);
      const response = await axios.delete('http://localhost:3001/delete', {
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authorization
        },
      });

      if (response.status === 200) {
        alert('Your account has been deleted.');
        localStorage.clear(); // Clear stored user data
        window.location.href = '/register'; // Redirect to registration or home page
      }
    } catch (error) {
      console.error('Error deleting account:', error.response?.data || error.message);
      alert('Failed to delete account. Please try again.');
    }
  };

  // Poista suosikkielokuva
  const handleRemoveFavorite = async (movieId) => {
    const token = localStorage.getItem('token'); // Get token

    if (!token) {
      alert('You need to be logged in to remove favorite movies.');
      return;
    }

    try {
      console.log(`Removing movie with ID: ${movieId}`);
      await axios.delete(`http://localhost:3001/suosikit/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Päivitä suosikkielokuvat tilassa
      setFavoriteMovies(favoriteMovies.filter(movie => movie.movie_id !== movieId));
    } catch (error) {
      console.error('Error removing favorite movie:', error.response?.data || error.message);
      alert('Failed to remove favorite movie. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>You need to log in to access the profile page.</p>
            <button onClick={closePopup}>Go to Login</button>
          </div>
        </div>
      )}

      {!showPopup && profile && (
        <>
          <h1>Welcome, {profile.käyttäjänimi}!</h1>
          <p>Email: {profile.sähköposti}</p>
          <p>First Name: {profile.etunimi}</p>
          <p>Last Name: {profile.sukunimi}</p>
          <button className="logout-button" onClick={handleLogout}>
            Kirjaudu Ulos
          </button>
          <button onClick={handleDeleteAccount} className="delete-button">
            Poista käyttäjätili
          </button>

          {/* Suosikkielokuvien osio */}
          <div className="favorites-section">
            <h2>Your Favorite Movies</h2>
            {favoriteMovies.length > 0 ? (
              <div className="favorites-scroll-container">
                {favoriteMovies.map((movie) => (
                  <div className="favorite-card" key={movie.movie_id}>
                    <img
                      src={movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                        : 'https://via.placeholder.com/300x450?text=No+Image'
                      }
                      alt={movie.title}
                    />
                    <h3>{movie.title}</h3>
                    <p>Release Year: {movie.release_date?.split('-')[0] || 'Unknown'}</p>
                    <button onClick={() => handleRemoveFavorite(movie.movie_id)}>
                      Poista suosikeista 
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>You have no favorite movies yet.</p>
            )}
          </div>
        </>
      )}

      {!showPopup && !profile && <p>Loading...</p>}
    </div>
  );
};

export default Profile;
