create table käyttäjä (
    id serial PRIMARY key,
    etunimi varchar(50) not null,
    sukunimi varchar(50) not null,
    salasana varchar(255) not null,
    sähköposti varchar(50) not null,
    käyttäjänimi varchar(50) not null,
    syntymäpäivä date not null
);