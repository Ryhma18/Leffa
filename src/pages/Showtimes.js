import React from 'react';

const Showtimes = () => {
  const showtimes = [
    {
      id: 1,
      movieTitle: "Elokuva 1",
      times: ["12:00", "15:30", "19:00", "21:30"]
    },
    {
      id: 2,
      movieTitle: "Elokuva 2",
      times: ["13:00", "16:30", "20:00"]
    },
    {
      id: 3,
      movieTitle: "Elokuva 3",
      times: ["14:00", "17:30", "21:00"]
    }
  ];

  return (
    <div>
      <h1>Näytösajat</h1>
      <div className="showtimes-list">
        {showtimes.map((showtime) => (
          <div key={showtime.id} className="showtime-card">
            <h2>{showtime.movieTitle}</h2>
            <p><strong>Näytösajat:</strong></p>
            <ul>
              {showtime.times.map((time, index) => (
                <li key={index}>{time}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Showtimes;
