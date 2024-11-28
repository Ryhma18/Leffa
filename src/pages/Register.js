import React, { useState } from "react";
import "./styles.css";
import axios from "axios";

const url = 'http://localhost:3001/'

const Register = () => {
  const [formData, setFormData] = useState({
    etunimi:'',
    sukunimi:'',
    salasana:'',
    sähköposti:'',
    käyttäjänimi:'',
    syntymäpäivä:'',

  });

const [showPopup, setShowPopup] = useState(false);
const [popupMessage, setPopupMessage] = useState("");
const [message, setMessage] = useState("");
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

  };
  
  const handlesubmit = async(event) => {
    event.preventDefault(); // Prevent form reload


    try{
      const response = await axios.post("http://localhost:3001/create", formData);
      if (response.status === 201) {
        setPopupMessage("Account created successfully!");
        setShowPopup(true);
        setFormData({
            etunimi: "",
            sukunimi: "",
            salasana: "",
            sähköposti: "",
            käyttäjänimi: "",
            syntymäpäivä: "",
        });
    
      }
    } catch (error) {
      console.error("Käyttäjän luonti epäonnistui:", error);
      setPopupMessage('Käyttäjän luonti epäonnistui. Yritä uudelleen.');
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  
  return (
    <div className="register-container">
      <div className="register-box">
        <div className="avatar">
          <img
            src="https://via.placeholder.com/80"
            alt="Avatar"
            className="avatar-icon"
          />
        </div>
        <h2>Käyttäjän luonti</h2>
        <form onSubmit={handlesubmit}>
          <div className="form-group">
            <label htmlFor="email">Sähköposti*</label>
            <input type="email" id="email" placeholder="@ Sähköposti" name="sähköposti"required
              value={formData.sähköposti}
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="firstName">Etunimi*</label>
              <input type="text" id="firstName" placeholder="Etunimi" name="etunimi"required 
                value={formData.etunimi}
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Sukunimi*</label>
              <input type="text" id="lastName" placeholder="Sukunimi" name="sukunimi"required 
                value={formData.sukunimi}
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Salasana</label>
            <input type="password" id="password" placeholder="Salasana" name="salasana"required 
              value={formData.salasana}
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="birthDate">Syntymäaika</label>
            <input type="date" id="birthDate" name="syntymäpäivä"required 
              value={formData.syntymäpäivä}
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Käyttäjänimi</label>
            <input type="text" id="username" placeholder="Käyttäjänimi"name="käyttäjänimi" required
              value={formData.käyttäjä}
              onChange={handleInputChange} 
             />
          </div>
          <button type="submit" className="register-button">
            Luo käyttäjä
          </button>
        </form>
        <div className="login-link">
          <p>Onko sinulla jo käyttäjätili?</p>
          <a href="/login">Kirjaudu sisään</a>
        </div>
          {/* Popup Window */}
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>{popupMessage}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Register;
