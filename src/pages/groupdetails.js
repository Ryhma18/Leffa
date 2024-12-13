import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./styles.css";

const GroupDetails = () => {
    const { id } = useParams(); // Get group ID from URL
    const [group, setGroup] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchGroupDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await axios.get(`http://localhost:3001/groups/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setGroup(response.data.group);
                setPendingRequests(response.data.pendingRequests || []);
            } catch (err) {
                console.error("Error fetching group details:", err.response?.data || err.message);
                setMessage(err.response?.data?.error || "Failed to load group details.");
            }
        };

        fetchGroupDetails();
    }, [id]);

    const handleRequestResponse = async (requestId, status) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await axios.post(
                "http://localhost:3001/groups/requests/respond",
                { requestId, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(response.data.message);
            setPendingRequests(pendingRequests.filter((req) => req.request_id !== requestId));
        } catch (err) {
            console.error("Error responding to request:", err.response?.data || err.message);
            setMessage(err.response?.data?.error || "Failed to respond to request.");
        }
    };

    if (!group) {
        return <p>Loading group details...</p>;
    }

    return (
        <div className="group-details-container">
            <h1>{group.nimi}</h1>
            <p>{group.kuvaus}</p>
            <p>Created on: {new Date(group.luomispäivä).toLocaleDateString()}</p>

            {message && <p className="message">{message}</p>}

            {/* If the user is the creator, show pending requests */}
            {pendingRequests.length > 0 && (
                <div className="pending-requests">
                    <h2>Pending Join Requests</h2>
                    {pendingRequests.map((request) => (
                        <div key={request.request_id} className="request-card">
                            <p><strong>User:</strong> {request.käyttäjänimi}</p>
                            <p><strong>Email:</strong> {request.sähköposti}</p>
                            <p><strong>Request Date:</strong> {new Date(request.request_date).toLocaleString()}</p>
                            <button onClick={() => handleRequestResponse(request.request_id, "approved")}>
                                Approve
                            </button>
                            <button onClick={() => handleRequestResponse(request.request_id, "rejected")}>
                                Reject
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupDetails;
