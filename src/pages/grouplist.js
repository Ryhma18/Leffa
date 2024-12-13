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

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get("http://localhost:3001/groups");
                setGroups(response.data);
            } catch (err) {
                console.error("Error fetching groups:", err.message);
                setError("Failed to load groups. Please try again later.");
            }
        };

        fetchGroups();
    }, []);

    const fetchUserGroups = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You must be logged in to view your groups.");
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
            setMessage("You must be logged in to request to join a group.");
            return;
        }
    
        try {
            const response = await axios.post(
                "http://localhost:3001/groups/request-join",
                { ryhmä_id: groupId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(response.data.message);
        } catch (err) {
            console.error("Error requesting to join group:", err.response?.data || err.message);
            setMessage(err.response?.data?.error || "Failed to send join request. Please try again.");
        }
    };

    return (
        <div className="group-list-container">
            <div className="header">
                <h1>Luodut ryhmät</h1>
                {/* Show "Create Group" button only if logged in */}
                {isLoggedIn && (
                    <Link to="/creategroup">
                        <button className="create-group-button">Luo uusi ryhmä</button>
                    </Link>
                )}
            </div>
    
            {error && <p className="error">{error}</p>}
    
            <div className="group-list">
                {/* Display all groups */}
                {groups.map((group) => (
                    <div key={group.id} className="group-card">
                        <h2>{group.nimi}</h2>
                        <p>{group.kuvaus}</p>
                        <p>Luotu: {new Date(group.luomispäivä).toLocaleDateString()}</p>
                        {isLoggedIn ? (
                        <button
                        className="request-join-button"
                        onClick={() => handleRequestJoin(group.id)}>
                        Lähetä liittymispyyntö
                        </button>
                        ) : (
                        <p className="login-prompt">
                        Haluatko liittyä ryhmään? <a href="/login">Kirjaudu sisään täällä</a>.
                        </p>
                        )}
                    </div>
                ))}
            </div>
    
            {/* Button to toggle user's joined groups */}
            {isLoggedIn && (
                <div className="user-groups-toggle">
                    <button
                        className="toggle-user-groups-button"
                        onClick={handleToggleUserGroups}
                    >
                        {showUserGroups ? "Piilota omat ryhmät" : "Näytä omat ryhmät"}
                    </button>
                </div>
            )}
    
            {/* Display user's joined groups if toggled */}
            {showUserGroups && (
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
        </div>
    );
};;

export default GroupList;