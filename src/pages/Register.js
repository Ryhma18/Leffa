import React, {  useState } from "react";
import "./styles.css";
import axios from "axios";

const url = 'http://localhost:3001/'

const Register = () => {
  const [post,setPost] = useState({
    sähköposti:'',
    etunimi:'',
    sukunimi:'',
    salasana:'',
    syntymäpäivä:'',
    käyttäjänimi:''
  })

 
  
  const handleInput = (event) => {
    setPost({...post, [event.target.name]:event.target.value})

  }
  
  const handlesubmit = async(event) => {
    event.preventDefault();
    try{
      const response = await axios.post(url + 'create',post);
      console.log(response.data)
      setPost({
        sähköposti:'',
        etunimi:'',
        sukunimi:'',
        salasana:'',
        syntymäpäivä:'',
        käyttäjänimi:''
      })
    

    }catch(error){
      console.log(error)
    }
  }
  
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
              value={post.sähköposti}
              onChange={handleInput} 
            />
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="firstName">Etunimi*</label>
              <input type="text" id="firstName" placeholder="Etunimi" name="etunimi"required 
                value={post.etunimi}
                onChange={handleInput} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Sukunimi*</label>
              <input type="text" id="lastName" placeholder="Sukunimi" name="sukunimi"required 
                value={post.sukunimi}
                onChange={handleInput} 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Salasana</label>
            <input type="password" id="password" placeholder="Salasana" name="salasana"required 
              value={post.salasana}
              onChange={handleInput} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="birthDate">Syntymäaika</label>
            <input type="date" id="birthDate" name="syntymäpäivä"required 
              value={post.syntymäpäivä}
              onChange={handleInput} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Käyttäjänimi</label>
            <input type="text" id="username" placeholder="Käyttäjänimi"name="käyttäjänimi" required
              value={post.käyttäjä}
              onChange={handleInput} 
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
      </div>
    </div>
  );
};

export default Register;
