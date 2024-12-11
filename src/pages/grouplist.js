import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles.css";

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const isLoggedIn = !!localStorage.getItem("token");

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

    const handleJoinGroup = async (groupId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You must be logged in to join a group.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3001/groups/join",
                { ryhmä_id: groupId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage(response.data.message);
        } catch (err) {
            console.error("Error joining group:", err.response?.data || err.message);
            setMessage(err.response?.data?.error || "Failed to join group. Please try again.");
        }
    };

    return (
        <div className="group-list-container">
            <div className="header">
                <h1>Luodut ryhmät</h1>
                {/* Show "Create Group" button only if logged in */}
                {isLoggedIn && (
                    <Link to="/create-group">
                        <button className="create-group-button">Luo uusi ryhmä</button>
                    </Link>
                )}
            </div>
            {error && <p className="error">{error}</p>}
            <div className="group-list">
                {groups.map((group) => (
                    <div key={group.id} className="group-card">
                        <h2>{group.nimi}</h2>
                        <p>{group.description}</p>
                        <p>Luotu: {new Date(group.luomispäivä).toLocaleDateString()}</p>
                        {isLoggedIn && (
                        <button
                        className="join-group-button" onClick={() => handleJoinGroup(group.id)}>
                        Liity ryhmään
                        </button>
                        )}
                        {!isLoggedIn && (
                        <p className="login-prompt">
                        Haluatko liittyä ryhmään? <a href="/login">Kirjaudu sisään täällä</a>.
                        </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};;

export default GroupList;