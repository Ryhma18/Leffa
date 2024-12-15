import React, { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa"; // Import from 'react-icons/fa'
import "./ToggleSwitch.css"; // Link to the CSS file for the toggle switch styling

const ToggleSwitch = ({ onToggle }) => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
    onToggle(!isOn); // Pass the state to the parent component (useful for global theme change)
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
