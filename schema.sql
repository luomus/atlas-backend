CREATE TABLE users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username VARCHAR(30) UNIQUE,
	password VARCHAR(50),
	name VARCHAR(100)
);

CREATE TABLE species (
	id INTEGER AUTOINCREMENT,
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


CREATE TABLE grid (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	coordinateN INTEGER,
	coordinateE INTEGER,
	municipality_id INTEGER REFERENCES municipality,
	gridName varchar(50)
);

CREATE TABLE grid_atlas3 (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	grid_id INTEGER REFERENCES grid,
	level1 FLOAT,
	level2 FLOAT,
	level3 FLOAT,
	level4 FLOAT,
	level5 FLOAT,
	activitySum INTEGER,
	activityCategory INTEGER
);


CREATE TABLE grid_atlas12 (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	grid_id INTEGER REFERENCES grid,
	realiability_atlas1 INTEGER,
	realiability_atlas2 INTEGER,
	realiability_combined INTEGER
);


CREATE TABLE municipality (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	municipality varchar(100),
	societyNameFI varchar(100),
	societyNameSV varchar(100),
	regionNumber INTEGER
);


CREATE TABLE bird_data_atlas3 (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	species_code INTEGER REFERENCES species,
	grid_id INTEGER REFERENCES grid,
	breedingIndex INTEGER,
	breedingCategory INTEGER
);


CREATE TABLE bird_data_atlas12 (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	species_code INTEGER REFERENCES species,
	grid_id INTEGER REFERENCES grid,
	breedingIndex_atlas1 INTEGER,
	breedingIndex_atlas2 INTEGER,
	breedingIndex_combined INTEGER
);


CREATE TABLE plant_data (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	year INTEGER,
	species_code INTEGER REFERENCES species,
	grid_id INTEGER REFERENCES grid,
	prevalence FLOAT,
	numberOfObservations INTEGER,
	oldestObservation INTEGER,
	newestObservation INTEGER
);
