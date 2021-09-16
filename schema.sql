CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(30) UNIQUE,
	password VARCHAR(50),
	name VARCHAR(100)
);

CREATE TABLE species (
	id SERIAL PRIMARY KEY,
	speciesFI VARCHAR(100),
	speciesEN VARCHAR(100),
	speciesSCI VARCHAR(100),
	speciesAbbr VARCHAR(6),
	speciesGroup_id REFERENCES speciesGroup,
	visibility INTEGER
);

CREATE TABLE speciesGroup (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100)
);

CREATE TABLE grid (
	id SERIAL PRIMARY KEY,
	coordinateN varchar(10),
	coordinateE varchar(10),
	municipality varchar(50),
	regionNumber varchar(20),
	societyNameFI varchar(50),
	societyNameSV varchar(50),
	gridName varchar(50),
	activitySum INTEGER,
	activityCategory INTEGER,
);

CREATE TABLE datasquare_bird (
	id SERIAL PRIMARY KEY,
	speciesGroup_id INTEGER REFERENCES speciesGroup,
	species_id INTEGER REFERENCES species,
	grid_id INTEGER REFERENCES grid,
	breedingIndex INTEGER,
	breedingCategory INTEGER,
	year INTEGER
);
