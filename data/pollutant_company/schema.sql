.mode columns
.width 5 25 
.headers on
.nullvalue NULL

DROP TABLE IF EXISTS company;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS map;

CREATE TABLE company(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name char[100],
    lat FLOAT,
    lon FLOAT,
    city char[6] REFERENCES cities(adcode)
);

CREATE TABLE cities(
    adcode char[6] PRIMARY KEY,
    city char[20],
    province char[20]
);

CREATE TABLE map(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INT,
    company INTEGER REFERENCES company(id),
    water BOOLEAN,
    air BOOLEAN,
    earth BOOLEAN
);
