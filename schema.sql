CREATE TABLE users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username VARCHAR(30) UNIQUE,
	password VARCHAR(50),
	name VARCHAR(100)
);

CREATE TABLE species (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	speciesFI VARCHAR(100),
	speciesEN VARCHAR(100),
	speciesSCI VARCHAR(100),
	speciesAbbr VARCHAR(6),
	speciesGroup_id REFERENCES speciesGroup,
	visibility INTEGER
);

CREATE TABLE speciesGroup (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(100)
);

CREATE TABLE grid (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	coordinateN varchar(10),
	coordinateE varchar(10),
	municipality varchar(50),
	regionNumber varchar(20),
	societyNameFI varchar(50),
	societyNameSV varchar(50),
	gridName varchar(50),
	activitySum INTEGER,
	activityCategory INTEGER
);


CREATE TABLE datasquare_bird (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	speciesGroup_id INTEGER REFERENCES speciesGroup,
	species_id INTEGER REFERENCES species,
	grid_id INTEGER REFERENCES grid,
	breedingIndex INTEGER,
	breedingCategory INTEGER,
	year INTEGER
);
