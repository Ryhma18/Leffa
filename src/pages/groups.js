import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Groups = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserGroups = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("You must be logged in to access this page.");
            navigate("/login"); // Redirect to login if not logged in
            return;
        }

        try {
            console.log("Fetching groups with token:", token);
            const response = await axios.get("http://localhost:3001/groups/mine", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Groups fetched:", response.data);
            setUserGroups(response.data);
        } catch (err) {
            console.error("Error fetching user groups:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Failed to load your groups. Please try again later.");
        }
    };

    fetchUserGroups();
}, [navigate]);

const handleLeaveGroup = async (groupId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        setMessage("You must be logged in to leave a group.");
        return;
    }

    const confirmLeave = window.confirm(
        "Are you sure you want to leave this group? You will lose access to it."
    );

    if (!confirmLeave) {
        return;
    }

    try {
        const response = await axios.delete("http://localhost:3001/groups/leave", {
            headers: { Authorization: `Bearer ${token}` },
            data: { ryhmä_id: groupId },
        });

        setMessage(response.data.message);
        setUserGroups(userGroups.filter((group) => group.id !== groupId)); // Remove group from state
    } catch (err) {
        console.error("Error leaving group:", err.response?.data || err.message);
        setMessage(err.response?.data?.error || "Failed to leave group. Please try again.");
    }
};

  return (
    <div className="user-groups-container">
        <h1>Sinun Ryhmät</h1>
        {error && <p className="error">{error}</p>}
        <div className="user-groups-list">
    {userGroups.map((group) => (
        <div key={group.id} className="user-group-card">
            <h2>{group.nimi}</h2>
            <p>{group.description}</p>
            <p>Created on: {new Date(group.luomispäivä).toLocaleDateString()}</p>
            <button
            className="leave-group-button"
            onClick={() => handleLeaveGroup(group.id)}>
            Poistu ryhmästä
            </button>
            </div>
            ))}
        </div>
    </div>
);
};

export default Groups;