import React from "react";
import "./styles.css";

const Login = () => {
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
        <form>
          <div className="form-group">
            <label htmlFor="username">Käyttäjätunnus</label>
            <input type="text" id="username" placeholder="Käyttäjätunnus" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Salasana</label>
            <input type="password" id="password" placeholder="Salasana" />
          </div>
          <button type="submit" className="login-button">Kirjaudu</button>
        </form>
        <div className="register-link">
          <p>Eikö sinulla ole käyttäjätunnusta?</p>
          <a href="/register">Luo käyttäjätunnus</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
