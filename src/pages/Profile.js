import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const closePopup = () => {
      setShowPopup(false);
      window.location.href = "/login"; // Redirect to login
    };


    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token"); // Get token

            if (!token) {
                setShowPopup(true);
                return;
            }

            try {
              console.log("Fetching profile...")  
              const response = await axios.get("http://localhost:3001/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach token
                    },
                });
                console.log("Profile data:", response.data);
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:",error.response?.data || error.message);
                localStorage.removeItem("token"); // Clear invalid token
                window.location.href = "/login"; // Redirect to login
                setShowPopup(true);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the token
        window.location.href = "/login"; // Redirect to login page
      };
      
      const handleDeleteAccount = async () => {
          const token = localStorage.getItem('token');
      
          if (!token) {
              alert('Tokenia ei löydy, ole hyvä ja kirjaudu sisään uudelleen');
              window.location.href = "/login";
              return;
          }
      
          const confirmDelete = window.confirm('Oletko varma että haluat poistaa käyttäjän? Poistamista ei voi kumota.');
      
          if (!confirmDelete) {
              return;
          }
      
          try {
            console.log("Sending delete request with token:", token);
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
                  <button className="logout-button" onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                  }}>Log Out</button>
                  <button onClick={handleDeleteAccount} className="delete-button">
                    Delete Account</button>
              </>
          )}

          {!showPopup && !profile && <p>Loading...</p>}
      </div>
  );
};



export default Profile;
