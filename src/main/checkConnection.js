
const oracledb = require('oracledb')
const fs = require('fs');

//You will also need to create a 'pass.txt' file to the root of the project.
//The file should contain the password only.

//This file can be run with 'node checkConnection.js' command.
//You need to use the university VPN connection for this.

const pass = fs.readFileSync("pass.txt")
const pw = pass.toString()



async function checkConnection() {

  let connection;
    try {
      connection = await oracledb.getConnection( {
      user : "atlas_staging",
      password : pw,
      connectString : "oracle.luomus.fi:1521/oracle.luomus.fi"
      });
      console.log("Connected to Oracle Database")
      
      params = [ '27850' ]
      let result = await connection.execute(`SELECT mxCode AS "mxCode", speciesFI AS "speciesFI",
      speciesSV AS "speciesSV", speciesEN AS "speciesEN", speciesSCI AS "speciesSCI",
      speciesAbbr AS "speciesAbbr", speciesGroup_id AS "speciesGroup_id", visibility 
      AS "visibility" FROM species WHERE mxcode = :mxcode`, params, { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT});
      const rs = result.resultSet;
      
      let row;

      while ((row = await rs.getRow())) {
          console.log(row)
      }
      
    await rs.close();
  
  } catch (err) {
    console.error(err.message)
  } finally {
    if (connection)
      try {
        await connection.close()
        console.log('Database connection closed')
      } catch (err) {
        console.error(err.message);
      }
  }
}

checkConnection()
