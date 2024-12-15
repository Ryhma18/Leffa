import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

const ManageRequests = ({ groupId }) => {
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await axios.get(`http://localhost:3001/groups/requests/${groupId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequests(response.data);
            } catch (err) {
                console.error("Error fetching requests:", err.response?.data || err.message);
                setMessage(err.response?.data?.error || "Failed to load requests.");
            }
        };

        fetchRequests();
    }, [groupId]);

    const handleResponse = async (requestId, status) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await axios.post(
                "http://localhost:3001/groups/requests/respond",
                { requestId, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(response.data.message);
            setRequests(requests.filter((request) => request.request_id !== requestId));
        } catch (err) {
            console.error("Error responding to request:", err.response?.data || err.message);
            setMessage(err.response?.data?.error || "Failed to respond to request.");
        }
    };

    return (
        <div className="manage-requests-container">
            <h1>Manage Join Requests</h1>
            {message && <p className="message">{message}</p>}
            {requests.length > 0 ? (
                requests.map((request) => (
                    <div key={request.request_id} className="request-card">
                        <p><strong>User:</strong> {request.käyttäjänimi}</p>
                        <p><strong>Email:</strong> {request.sähköposti}</p>
                        <p><strong>Request Date:</strong> {new Date(request.request_date).toLocaleString()}</p>
                        <button onClick={() => handleResponse(request.request_id, "approved")}>
                            Approve
                        </button>
                        <button onClick={() => handleResponse(request.request_id, "rejected")}>
                            Reject
                        </button>
                    </div>
                ))
            ) : (
                <p>No pending requests.</p>
            )}
        </div>
    );
};

export default ManageRequests;
