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
                console.log("Fetching profile...");
                const response = await axios.get("http://localhost:3001/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach token
                    },
                });
                console.log("Profile data:", response.data);
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error.response?.data || error.message);
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
        const token = localStorage.getItem("token"); // Get token
        if (!token) {
            setError("You are not authorized.");
            return;
        }

        try {
            console.log("Deleting account...");
            await axios.delete("http://localhost:3001/delete-account", {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token
                },
            });
            console.log("Account deleted.");
            localStorage.removeItem("token"); // Clear the token
            window.location.href = "/login"; // Redirect to login
        } catch (error) {
            console.error("Error deleting account:", error.response?.data || error.message);
            setError("Failed to delete account. Please try again.");
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
                    {error && <p className="error">{error}</p>}
                    <button className="logout-button" onClick={handleLogout}>Log Out</button>
                    <button className="delete-account-button" onClick={handleDeleteAccount}>
                        Delete Account
                    </button>
                </>
            )}

            {!showPopup && !profile && <p>Loading...</p>}
        </div>
    );
};

export default Profile;
