import React, { useState } from "react";
import axios from "axios";

const CreateGroup = () => {
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [message, setMessage] = useState("");

    const handleCreateGroup = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You must be logged in to create a group.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3001/groups/create",
                { nimi: groupName, kuvaus: groupDescription },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("Ryhmän luonti onnistui!");
            setGroupName("");
            setGroupDescription("");
        } catch (error) {
            console.error("Ryhmän luonti epäonnistui:", error.response?.data || error.message);
            setMessage("Ryhmän luonti epäonnistui, yritä uudelleen.");
        }
    };

    return (
        <div className="create-group-container">
            <h1>Create a New Group</h1>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleCreateGroup}>
                <div>
                    <label>Ryhmän nimi:</label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Ryhmän kuvaus:</label>
                    <textarea
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
};

export default CreateGroup;