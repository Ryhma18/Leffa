import React, { useState } from "react";

const Showtimes = () => {
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [schedule, setSchedule] = useState([]); 

  const handleSearch = async () => {
    if (!selectedArea || !selectedDate) {
      alert("Valitse alue ja päivämäärä.");
      return;
    }

    try {
      
      const formattedDate = new Date(selectedDate).toLocaleDateString("fi-FI");

      
      const response = await fetch(
        `https://www.finnkino.fi/xml/Schedule/?area=${selectedArea}&dt=${formattedDate}`
      );
      const text = await response.text();

      // Parse XML
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");

      // Muotoile näytöstiedot
      const shows = Array.from(xml.getElementsByTagName("Show")).map((show) => {
        return {
          title: show.getElementsByTagName("Title")[0]?.textContent,
          time: show.getElementsByTagName("dttmShowStart")[0]?.textContent,
          theatre: show.getElementsByTagName("Theatre")[0]?.textContent,
        };
      });

      setSchedule(shows); 
    } catch (error) {
      console.error("Näytöstietojen haku epäonnistui:", error);
    }
  };

  return (
    <div className="showtimes-container">
      {/* Dropdown-valikot ja hakupainike */}
      <div className="dropdown-container">
        <select
          className="dropdown"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          <option value="">Valitse alue/teatteri</option>
          <option value="1014">Pääkaupunkiseutu</option>
          <option value="1012">Espoo</option>
          <option value="1002">Helsinki</option>
          <option value="1018">Oulu</option>
        </select>

        <input
          type="date"
          className="dropdown"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button className="search-button" onClick={handleSearch}>
          Etsi näytökset
        </button>
      </div>

      {/* Näytetään haetut näytöstiedot */}
      <div className="schedule-container">
        {schedule.length > 0 ? (
          schedule.map((show, index) => (
            <div key={index} className="schedule-item">
              <h3>{show.title}</h3>
              <p>
                Aika: {new Date(show.time).toLocaleTimeString("fi-FI")} |{" "}
                Teatteri: {show.theatre}
              </p>
            </div>
          ))
        ) : (
          <p>Ei näytöksiä valituille kriteereille.</p>
        )}
      </div>
    </div>
  );
};

export default Showtimes;
