import React, { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa"; 
import "./ToggleSwitch.css"; 

const ToggleSwitch = ({ onToggle }) => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
    onToggle(!isOn); 
  };

  return (
    <div className="toggle-switch" onClick={handleToggle}>
      <div className={`toggle-switch-inner ${isOn ? "on" : "off"}`}>
        <div className={`toggle-switch-circle ${isOn ? "on" : "off"}`}></div>
      </div>
      <div className="icon">
        {isOn ? <FaMoon size={20} color="white" /> : <FaSun size={20} color="yellow" />}
      </div>
    </div>
  );
};

export default ToggleSwitch;
