import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles.css";

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const isLoggedIn = !!localStorage.getItem("token");
    const [showUserGroups, setShowUserGroups] = useState(false);
    const [userGroups, setUserGroups] = useState([]);
    const [popupMessage, setPopupMessage] = useState("");
    const [loginPromptShown, setLoginPromptShown] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get("http://localhost:3001/groups");
                setGroups(response.data);
            } catch (err) {
                console.error("Error fetching groups:", err.message);
                setError("Failed to load groups. Please try again later.");
            }
    
            
            if (!isLoggedIn && !loginPromptShown) {
                setPopupMessage("Sinun täytyy kirjautua sisään lähettääksesi liittymispyynnön.");
                setLoginPromptShown(true); 
            }
        };
    
        fetchGroups();
    }, [isLoggedIn, loginPromptShown]);

    const fetchUserGroups = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Sinun täytyy kirjautua sisään nähdäksesi ryhmäsi.");
            return;
        }

        try {
            const response = await axios.get("http://localhost:3001/groups/mine", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserGroups(response.data);
        } catch (err) {
            console.error("Error fetching user groups:", err.response?.data || err.message);
            setMessage(err.response?.data?.error || "Failed to load your groups. Please try again.");
        }
    };

    const handleToggleUserGroups = () => {
        if (!showUserGroups) {
            fetchUserGroups();
        }
        setShowUserGroups(!showUserGroups);
    };

    const handleRequestJoin = async (groupId) => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            setPopupMessage("Sinun täytyy kirjautua sisään lähettääksesi liittymispyynnön.");
            return;
        }
    
        try {
            const response = await axios.post(
                "http://localhost:3001/groups/request-join",
                { ryhmä_id: groupId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            setPopupMessage("Liittymispyyntö lähetetty!"); // Success message
        } catch (err) {
            console.error("Error requesting to join group:", err.response?.data || err.message);
            setPopupMessage(err.response?.data?.error || "Liittymispyyntö epäonnistui. Yritä uudelleen.");
        }
    
        // Automatically clear the popup after 5 seconds
        setTimeout(() => setPopupMessage(""), 5000);
    };

    return (
        <div className="group-list-container">
            {/* Login prompt at the top */}
            {!isLoggedIn && (
                <div className="login-prompt">
                    <p>Haluatko liittyä ryhmään? <a href="/login">Kirjaudu sisään täällä</a>.</p>
                </div>
            )}
    
            {/* Header Section */}
            <div className="header">
        <h1>Luodut ryhmät</h1>
        <div className="header-buttons">
            {/* Show "Create Group" button only if logged in */}
            {isLoggedIn && (
                <>
                    <Link to="/creategroup">
                        <button className="create-group-button">Luo uusi ryhmä</button>
                    </Link>
                    <button
                        className="toggle-user-groups-button"
                        onClick={handleToggleUserGroups}
                    >
                        {showUserGroups ? "Piilota omat ryhmät" : "Näytä omat ryhmät"}
                    </button>
                </>
            )}
        </div>
    </div>

        {/* Show User's Groups First */}
        {isLoggedIn && showUserGroups && (
            <div className="user-groups-list">
                <h2>Omat ryhmät</h2>
                {userGroups.length > 0 ? (
                    userGroups.map((group) => (
                        <div key={group.id} className="group-card">
                            <h2>{group.nimi}</h2>
                            <p>{group.kuvaus}</p>
                            <p>Luotu: {new Date(group.luomispäivä).toLocaleDateString()}</p>
                            <Link to={`/groups/${group.id}`} className="view-details-link">
                                <button className="view-details-button">Näytä ryhmän tiedot</button>
                            </Link>
                        </div>
                    ))
                ) : (
                <p>Et ole liittynyt mihinkään ryhmään.</p>
            )}
        </div>
    )}

    {/* Error Message */}
    {error && <p className="error">{error}</p>}
    
            {/* Error Message */}
            {error && <p className="error">{error}</p>}
    
            {/* Group List */}
            <div className="group-list">
                {groups.map((group) => (
                    <div key={group.id} className="group-card">
                        <h2>{group.nimi}</h2>
                        <p>{group.kuvaus}</p>
                        <p>Luotu: {new Date(group.luomispäivä).toLocaleDateString()}</p>
                        {isLoggedIn ? (
                            <button
                                className="request-join-button"
                                onClick={() => handleRequestJoin(group.id)}
                            >
                                Lähetä liittymispyyntö
                            </button>
                        ) : null}
                    </div>
                ))}
            </div>
                        
            {/* Display popup message */}
                {popupMessage && (
                <div className="popup">
                    <div className="popup-content">
                        <p>{popupMessage}</p>
                        <button onClick={() => setPopupMessage("")}>Close</button>
                    </div>
                </div>
            )}

        </div>
    );
};;

export default GroupList;