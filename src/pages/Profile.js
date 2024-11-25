import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState({
    etunimi: "",
    sukunimi: "",
    sähköposti: "",
    käyttäjänimi: "",
    syntymäpäivä: "",
  });

  const [editMode, setEditMode] = useState(false);

  // Fetch profile data from the server on component mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get("/api/profile"); // Adjust the endpoint
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    }
    fetchProfile();
  }, []);

  // Handle input changes in edit mode
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Save updated profile data
  const handleSave = async () => {
    try {
      await axios.put("/api/profile", profile); // Adjust the endpoint
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="profile">
      <h1>Profile</h1>
      <div className="profile-info">
        <div>
          <label>First Name:</label>
          {editMode ? (
            <input
              type="text"
              name="etunimi"
              value={profile.etunimi}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.etunimi}</p>
          )}
        </div>
        <div>
          <label>Last Name:</label>
          {editMode ? (
            <input
              type="text"
              name="sukunimi"
              value={profile.sukunimi}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.sukunimi}</p>
          )}
        </div>
        <div>
          <label>Email:</label>
          {editMode ? (
            <input
              type="email"
              name="sähköposti"
              value={profile.sähköposti}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.sähköposti}</p>
          )}
        </div>
        <div>
          <label>Username:</label>
          {editMode ? (
            <input
              type="text"
              name="käyttäjänimi"
              value={profile.käyttäjänimi}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.käyttäjänimi}</p>
          )}
        </div>
        <div>
          <label>Birthday:</label>
          {editMode ? (
            <input
              type="date"
              name="syntymäpäivä"
              value={profile.syntymäpäivä}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.syntymäpäivä}</p>
          )}
        </div>
      </div>
      {editMode ? (
        <div>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
      )}
    </div>
  );
}

export default Profile;
