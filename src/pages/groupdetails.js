import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./styles.css";
import { jwtDecode } from "jwt-decode";

const GroupDetails = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [message, setMessage] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const token = localStorage.getItem("token");
    const [Movies, setMovies] = useState([]);

        
        console.log("Token retrieved from localStorage:", token);

       
        const currentUserId = token ? jwtDecode(token).id : null;
    
       
        if (token) {
            console.log("Decoded Token:", jwtDecode(token));
            console.log("Current User ID:", currentUserId);
        } else {
            console.error("No token found. User is not logged in.");
        }
    
        useEffect(() => {
            const fetchmovies = async () => {
              const token = localStorage.getItem('token'); 
        
              if (!token) {
                return;
              }
        
              try {
                const response = await axios.get('http://localhost:3001/elokuva', {
                  headers: {
                    Authorization: `Bearer ${token}`, 
                  },
                });
                setMovies(response.data);
              } catch (error) {
                console.error('Error fetching  movies:', error.response?.data || error.message);
              }
            };
        
            fetchmovies();
          }, []);
          
          const handleRemoveMovie = async (movieId) => {
            const token = localStorage.getItem('token'); 
        
            if (!token) {
              alert('You need to be logged in to remove  movies.');
              return;
            }
        
            try {
              console.log(`Removing movie with ID: ${movieId}`);
              await axios.delete(`http://localhost:3001/elokuva/${movieId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
        
              
              setMovies(Movies.filter(movie => movie.movie_id !== movieId));
            } catch (error) {
              console.error('Error removing  movie:', error.response?.data || error.message);
              alert('Failed to remove  movie. Please try again.');
            }
          };  

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
                const membersResponse = await axios.get(`http://localhost:3001/groups/${id}/members`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setGroupMembers(membersResponse.data);
            } catch (err) {
                console.error("Error fetching group details:", err.response?.data || err.message);
                setMessage(err.response?.data?.error || "Failed to load group details.");
            }
        };
        fetchGroupDetails();
    }, [id]);

    const handleRemoveMember = async (memberId) => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            console.error("No token found. User is not logged in.");
            return;
        }
    
        const confirmRemove = window.confirm("Are you sure you want to remove this member?");
        if (!confirmRemove) return;
    
        try {
            const response = await axios.delete(`http://localhost:3001/groups/${group.id}/remove-member`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { userId: memberId }, 
            });
    
            if (response.status === 200) {
               
                setGroupMembers(groupMembers.filter((member) => member.id !== memberId));
                alert("Member removed successfully.");
            }
        } catch (error) {
            console.error("Error removing member:", error.response?.data || error.message);
            alert("Failed to remove member. Please try again.");
        }
    };

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

    const handleLeaveGroup = async (groupId) => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            console.error("No token found. User is not logged in.");
            return;
        }
    
        const confirmLeave = window.confirm("Oletko varma että haluat poistua ryhmäs?");
        if (!confirmLeave) return;
    
        try {
            const response = await axios.delete(`http://localhost:3001/groups/${groupId}/leave`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.status === 200) {
                alert(response.data.message);
                window.location.href = "/grouplist"; 
            }
        } catch (err) {
            console.error("Error leaving group:", err.response?.data || err.message);
            alert(err.response?.data?.error || "Failed to leave group. Please try again.");
        }
    };

    const handleDeleteGroup = async (groupId) => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            console.error("No token found. User is not logged in.");
            return;
        }
    
        const confirmDelete = window.confirm("Oletko varma että haluat poistaa ryhmän. Poistamista ei voi perua.");
        if (!confirmDelete) return;
    
        try {
            const response = await axios.delete(`http://localhost:3001/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.status === 200) {
                alert(response.data.message);
                window.location.href = "/grouplist"; 
            }
        } catch (err) {
            console.error("Error deleting group:", err.response?.data || err.message);
            alert(err.response?.data?.error || "Failed to delete group. Please try again.");
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
    
          
            {pendingRequests.length > 0 && (
                <div className="pending-requests">
                    <h2>Liittymispyynnöt</h2>
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
    
          
            <div className="group-members">
                <h2>Ryhmän jäsenet</h2>
                {groupMembers.length > 0 ? (
                    <ul>
                        {groupMembers.map((member) => (
                            <li key={member.id} className="member-card">
                                <p><strong>Nimi:</strong> {member.etunimi} {member.sukunimi}</p>
                                <p><strong>Käyttäjänimi:</strong> {member.käyttäjänimi}</p>
                                <p><strong>Sähköposti:</strong> {member.sähköposti}</p>
    
                                {group.creator_id === currentUserId && (
                                    <button
                                        className="remove-member-button"
                                        onClick={() => handleRemoveMember(member.id)}> Poista jäsen ryhmästä </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Ei jäseniä ryhmässä.</p>
                )}
            </div>
    
           
            <div className="group-actions">
               
                {group.creator_id === currentUserId && (
                    <button
                        className="delete-group-button"
                        onClick={() => handleDeleteGroup(group.id)}> Poista ryhmä </button>
                )}
    
              
                {groupMembers.some((member) => member.id === currentUserId) && group.creator_id !== currentUserId && (
                    <button
                        className="leave-group-button"
                        onClick={() => handleLeaveGroup(group.id)}> Poistu ryhmästä </button>
                )}
            </div>
                    <div className="favorites-section">
                    <h2>Movies</h2>
                    {Movies.length > 0 ? (
                      <div className="favorites-scroll-container">
                        {Movies.map((movie) => (
                          <div className="favorite-card" key={movie.movie_id}>
                            <img
                              src={movie.poster_path
                                ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                                : 'https://via.placeholder.com/300x450?text=No+Image'
                              }
                              alt={movie.title}
                            />
                            <h3>{movie.title}</h3>
                            <p>Release Year: {movie.release_date?.split('-')[0] || 'Unknown'}</p>
                            <button onClick={() => handleRemoveMovie(movie.movie_id)}>
                              Poista ryhmästä
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No movies added.</p>
                    )}
                  </div>
            

           
        </div>
    ); 
}

export default GroupDetails;
