CREATE TABLE users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username VARCHAR(30) UNIQUE,
	password VARCHAR(50),
	name VARCHAR(100)
);

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


CREATE TABLE grid (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	coordinateN INTEGER,
	coordinateE INTEGER,
	municipality_id INTEGER REFERENCES municipality,
	gridName varchar(100)
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
	realiabilityAtlas1 INTEGER,
	realiabilityAtlas2 INTEGER,
	realiabilityCombined INTEGER
);


CREATE TABLE municipality (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name varchar(100),
	birdSocietyNameFI varchar(100),
	birdSocietyNameSV varchar(100),
	regionNumber INTEGER
);


CREATE TABLE bird_data_atlas3 (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	species_id INTEGER REFERENCES species,
	grid_id INTEGER REFERENCES grid,
	breedingIndex INTEGER,
	breedingCategory INTEGER
);


CREATE TABLE bird_data_atlas12 (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	species_id INTEGER REFERENCES species,
	grid_id INTEGER REFERENCES grid,
	breedingIndexAtlas1 INTEGER,
	breedingIndexAtlas2 INTEGER,
	breedingIndexCombined INTEGER
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
