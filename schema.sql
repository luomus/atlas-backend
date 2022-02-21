CREATE TABLE Grid (
  id VARCHAR(100) PRIMARY KEY,
  coordinates VARCHAR(7),
  birdAssociationArea VARCHAR(100),
  name VARCHAR(100),
  level1 INTEGER,
  level2 FLOAT,
  level3 FLOAT,
  level4 FLOAT,
  level5 FLOAT
);


CREATE TABLE Atlas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  startingYear INTEGER,
  endingYear INTEGER,
  name VARCHAR(100)
);


CREATE TABLE AtlasGrid (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  atlas INTEGER REFERENCES Atlas,
  grid VARCHAR(100) REFERENCES Grid,
  atlasClassSum INTEGER,
  activityCategory VARCHAR(100)
);


CREATE TABLE AtlasGridSpeciesData (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  speciesId VARCHAR(100),
  grid VARCHAR(100) REFERENCES grid,
  atlas INTEGER REFERENCES atlas,
  atlasCode VARCHAR(100),
  atlasClass VARCHAR(100)
);
