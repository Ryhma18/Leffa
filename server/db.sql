create table käyttäjä (
    id serial PRIMARY key,
    etunimi varchar(50) not null,
    sukunimi varchar(50) not null,
    salasana varchar(255) not null,
    sähköposti varchar(50) not null,
    käyttäjänimi varchar(50) not null,
    syntymäpäivä date not null
);

create table arvostelu (
    id serial PRIMARY key,
    elokuva VARCHAR(50) not null,
    pisteet INTEGER not null,
    kuvaus VARCHAR(255) not null,
    käyttäjänimi VARCHAR(50) not null,
    luomispäivä date not null
);


create table ryhmät (
    id serial PRIMARY key,
    nimi VARCHAR(50) not null,
    kuvaus VARCHAR(50) not null,
    luomispäivä date not null,
    creator_id int not null
);

CREATE TABLE ryhmän_jäsenet (
    id SERIAL PRIMARY KEY,
    ryhmä_id INT NOT NULL REFERENCES ryhmät(id) ON DELETE CASCADE,
    käyttäjä_id INT NOT NULL REFERENCES käyttäjä(id) ON DELETE CASCADE,
    liittynyt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  suosikit (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES käyttäjä(id) ON DELETE CASCADE,
    movie_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    release_date VARCHAR(10),
    UNIQUE(user_id, movie_id)
);

CREATE TABLE  elokuva(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES käyttäjä(id) ON DELETE CASCADE,
    ryhmä_id INT NOT NULL REFERENCES ryhmät(id) ON DELETE CASCADE,
    movie_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    release_date VARCHAR(10),
    UNIQUE(user_id,ryhmä_id movie_id)
);

CREATE TABLE join_requests (
    id SERIAL PRIMARY KEY,
    ryhmä_id INT NOT NULL REFERENCES ryhmät(id) ON DELETE CASCADE,
    käyttäjä_id INT NOT NULL REFERENCES käyttäjä(id) ON DELETE CASCADE,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' -- 'pending', 'approved', 'rejected'
);