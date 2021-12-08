CREATE TABLE species (
	mxCode INTEGER PRIMARY KEY,
	speciesAbbr VARCHAR(6),
	speciesSCI VARCHAR(100),
	speciesFI VARCHAR(100),
	speciesSV VARCHAR(100),
	speciesEN VARCHAR(100),
	speciesGroup_id REFERENCES speciesGroup,
	visibility INTEGER
);


CREATE TABLE speciesGroup (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(100)
);


CREATE TABLE municipality (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name varchar(100),
	birdSocietyNameFI varchar(100),
	birdSocietyNameSV varchar(100),
	regionNumber INTEGER
);


CREATE TABLE grid (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	coordinateN INTEGER,
	coordinateE INTEGER,
	municipality_id INTEGER REFERENCES municipality,
	name varchar(100)
);


CREATE TABLE atlas (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	starting_year INTEGER,
	ending_year INTEGER,
	name varchar(100),
	speciesGroup_id REFERENCES speciesGroup
);


CREATE TABLE grid_bird_atlas (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	grid_id INTEGER REFERENCES grid,
	atlas_id INTEGER REFERENCES atlas,
	level1 FLOAT,
	level2 FLOAT,
	level3 FLOAT,
	level4 FLOAT,
	level5 FLOAT,
	activitySum INTEGER,
	activityCategory INTEGER
);


CREATE TABLE bird_data (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	species_id INTEGER REFERENCES species,
	grid_id INTEGER REFERENCES grid,
	atlas_id INTEGER REFERENCES atlas,
	breedingIndex INTEGER,
	breedingCategory INTEGER
);


CREATE TABLE plant_data (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	year INTEGER,
	species_code INTEGER REFERENCES species,
	grid_id INTEGER REFERENCES grid,
	atlas_id INTEGER REFERENCES atlas,
	prevalence FLOAT,
	numberOfObservations INTEGER,
	oldestObservation INTEGER,
	newestObservation INTEGER
);
