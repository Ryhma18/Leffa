import React, { useState } from "react";
import "./styles.css"; // Lisää CSS-tiedosto

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

      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");

      const shows = Array.from(xml.getElementsByTagName("Show")).map((show) => {
        const title = show.getElementsByTagName("Title")[0]?.textContent;
        const time = show.getElementsByTagName("dttmShowStart")[0]?.textContent;
        const theatre = show.getElementsByTagName("Theatre")[0]?.textContent;
        const language =
          show.getElementsByTagName("SpokenLanguage")[0]?.getElementsByTagName("Name")[0]?.textContent || "Ei tietoa";
        const subtitles =
          show.getElementsByTagName("SubtitleLanguage1")[0]?.getElementsByTagName("Name")[0]?.textContent || "Ei tekstityksiä";
        const rating = show.getElementsByTagName("RatingLabel")[0]?.textContent || "Ei ikärajaa";
        const image = show.getElementsByTagName("Images")[0]?.getElementsByTagName("EventMediumImagePortrait")[0]?.textContent;

        // Hakee salin tiedot TheatreAuditorium-tagista
        const room = show.getElementsByTagName("TheatreAuditorium")[0]?.textContent || "Ei salia tietoa";

        // Lisätyt kentät:
        const showEnd = show.getElementsByTagName("dttmShowEnd")[0]?.textContent || "Ei päättymisaikaa";
        const productionYear = show.getElementsByTagName("ProductionYear")[0]?.textContent || "Ei tuotantovuotta";
        const length = show.getElementsByTagName("LengthInMinutes")[0]?.textContent || "Ei kestoa";
        const genres = show.getElementsByTagName("Genres")[0]?.textContent || "Ei genrejä";

        return {
          title,
          time,
          showEnd,
          theatre,
          language,
          subtitles,
          rating,
          image,
          room,
          productionYear,
          length,
          genres
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

      {/* Näytetään haetut näytöstiedot ruudukossa */}
      <div className="schedule-grid">
        {schedule.length > 0 ? (
          schedule.map((show, index) => (
            <div key={index} className="schedule-item">
              <img
                src={show.image}
                alt={`${show.title} kuva`}
                className="movie-image"
              />
              <div className="movie-details">
                <h3>{show.title}</h3>
                <p>
                  Aika: {new Date(show.time).toLocaleTimeString("fi-FI")} | Teatteri: {show.theatre} | Sali: {show.room}
                </p>
                <p>Päättymisaika: {new Date(show.showEnd).toLocaleTimeString("fi-FI")}</p>
                <p>Tuotantovuosi: {show.productionYear}</p>
                <p>Kesto: {show.length} min</p>
                <p>Genre: {show.genres}</p>
                <p>Kieli: {show.language}</p>
                <p>Tekstitykset: {show.subtitles}</p>
                <p>Ikäraja: {show.rating}</p>
              </div>
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
