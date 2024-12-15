import React, { useState } from "react";
import "./styles.css";
import axios from "axios";



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

const [passwordStatus, setPasswordStatus] = useState({
  message: "Salasanan on oltava vähintään 8 merkkiä, joista yksi on oltava iso kirjain ja yksi numero.",
  isValid: false,
});

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const isValid = passwordRegex.test(password);
  setPasswordStatus({
    message: isValid ? "Salasana täyttää kriteerit." : "Salasanan on oltava vähintään 8 merkkiä, joista yksi on oltava iso kirjain ja yksi numero.",
    isValid: isValid,
  });
  return isValid;
};
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, salasana: password });
    validatePassword(password);
};
  
  const handlesubmit = async(event) => {
    event.preventDefault(); 
    if (!passwordStatus.isValid) {
      alert("Korjaa virheet ennen lomakkeen lähettämistä.");
      return;
  }


    try{
      const response = await axios.post("http://localhost:3001/create", formData);
      if (response.status === 201) {
        setPopupMessage("Käyttäjän luonti onnistui!");
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
              onChange={handlePasswordChange} 
            />
            <p className={passwordStatus.isValid ? "valid-text" : "error-text"}>
          {passwordStatus.message}
            </p>
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
