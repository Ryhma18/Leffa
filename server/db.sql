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


create table ryhmä (
    id serial PRIMARY key,
    nimi VARCHAR(50) not null,
    kuvaus VARCHAR(50) not null,
    luomispäivä date not null
);