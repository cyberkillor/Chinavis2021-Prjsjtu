.mode columns
.width 5 25 
.headers on
.nullvalue NULL

DROP TABLE IF EXISTS weatherdata;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS coordinates;

CREATE TABLE weatherdata(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INT,
    month INT,
    day INT,
    hour INT,
    lat FLOAT,
    lon FLOAT,
    city char[6] REFERENCES cities(citycode),
    pm25 FLOAT,
    pm10 FLOAT,
    o3 FLOAT,
    co FLOAT,
    so2 FLOAT,
    no2 FLOAT,
    u FLOAT,
    v FLOAT,
    temp FLOAT,
    rh FLOAT,
    psfc FLOAT
);

CREATE TABLE cities(
    citycode char[6] PRIMARY KEY,
    city char[20],
    province char[20]
);

CREATE TABLE coordinates(
    citycode char[6] REFERENCES cities(citycode),
    lat FLOAT,
    lon FLOAT
);