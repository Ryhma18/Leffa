import React, { useState } from "react";
import "./styles.css";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    käyttäjänimi: "",
    salasana: "",
  });

  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false); 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true); 

    console.log("Submitting formData:", formData);

    try {
      const response = await axios.post("http://localhost:3001/login", {
        käyttäjänimi: formData.käyttäjänimi,
        salasana: formData.salasana,
      });

      if (response.status === 200) {
        setMessage("Kirjautuminen onnistui!");
        localStorage.setItem("token", response.data.token); 
        window.location.href = "/profile"; 
      }
    } catch (error) {
      console.error("Login failed", error.response || error.message);
      if (error.response) {
        
        setMessage(error.response?.data?.message || "Virheellinen käyttäjätunnus tai salasana.");
      } else {
        
        setMessage("Palvelimessa on ongelmia. Yritä myöhemmin uudelleen.");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="avatar">
          <img
            src="https://via.placeholder.com/80"
            alt="Avatar"
            className="avatar-icon"
          />
        </div>
        <h2>Kirjaudu sisään</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Käyttäjätunnus</label>
            <input
              type="text"
              id="username"
              name="käyttäjänimi" 
              placeholder="Käyttäjätunnus"
              value={formData.käyttäjänimi}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Salasana</label>
            <input
              type="password"
              id="password"
              name="salasana" 
              placeholder="Salasana"
              value={formData.salasana}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Kirjaudutaan..." : "Kirjaudu"} 
          </button>
        </form>
        {message && <p className="message">{message}</p>} 
        <div className="register-link">
          <p>Eikö sinulla ole käyttäjätunnusta?</p>
          <a href="/register">Luo käyttäjätunnus</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
