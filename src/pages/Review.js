import React, {  useState } from "react";
import "./styles.css";
import axios from "axios";

const url = 'http://localhost:3001/'

const Review = () => {
  const [post,setPost] = useState({
    elokuva:'',
    pisteet:'',
    kuvaus:'',
    luomispäivä:'',
    käyttäjänimi:''
  })

 
  
  const handleInput = (event) => {
    setPost({...post, [event.target.name]:event.target.value})

  }
  
  const handlesubmit = async(event) => {
    
    try{
      const response = await axios.post(url + 'create/review',post);
      console.log(response.data)
      setPost({
        elokuva:'',
        pisteet:'',
        kuvaus:'',
        luomispäivä:'',
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
            <label htmlFor="email">Elokuva*</label>
            <input type="email" id="email" placeholder="Elokuva" name="elokuva"required
              value={post.elokuva}
              onChange={handleInput} 
            />
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="firstName">Pisteet*</label>
              <input type="text" id="pisteet" placeholder="pisteet" name="pisteet"required 
                value={post.pisteet}
                onChange={handleInput} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Kuvaus*</label>
              <input type="text" id="kuvaus" placeholder="Kuvaus" name="kuvaus"required 
                value={post.kuvaus}
                onChange={handleInput} 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="birthDate">Luomispäivä</label>
            <input type="date" id="luomispäivä" name="luomispäivä"required 
              value={post.luomispäivä}
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
      </div>
    </div>
  );
};

export default Review