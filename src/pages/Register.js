import React from "react";
import "./styles.css";

const Register = () => {
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
        <form>
          <div className="form-group">
            <label htmlFor="email">Sähköposti*</label>
            <input type="email" id="email" placeholder="@ Sähköposti" required />
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="firstName">Etunimi*</label>
              <input type="text" id="firstName" placeholder="Etunimi" required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Sukunimi*</label>
              <input type="text" id="lastName" placeholder="Sukunimi" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Salasana</label>
            <input type="password" id="password" placeholder="Salasana" required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Vahvista salasana</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Vahvista salasana"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthDate">Syntymäaika</label>
            <input type="date" id="birthDate" required />
          </div>
          <div className="form-group">
            <label htmlFor="username">Käyttäjänimi</label>
            <input type="text" id="username" placeholder="Käyttäjänimi" required />
          </div>
          <button type="submit" className="register-button">
            Luo käyttäjä
          </button>
        </form>
        <div className="login-link">
          <p>Onko sinulla jo käyttäjätili?</p>
          <a href="/login">Kirjaudu sisään</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
