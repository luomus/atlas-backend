
const oracledb = require('oracledb')
const fs = require('fs');

//You will also need to create a 'pass.txt' file to the root of the project.
//The file should contain the password only.

//This file can be run with 'node checkConnectionPromises.js' command.
//You need to use the university VPN connection for this.

const pass = fs.readFileSync("pass.txt")
const pw = pass.toString()


const dbConfig = {
  user : "atlas_staging",
          password : pw,
          connectString : "oracle.luomus.fi:1521/oracle.luomus.fi"
          };

let connection;
let query = "SELECT * FROM species WHERE visibility=1 AND mxCode>40000"

oracledb.getConnection(dbConfig).then(function(c) {
    console.log('Connected to Oracle database');
    connection = c;

    return connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT});
})
.then(result => {
    console.log('Query executed');
    console.log(result.rows);
})
.catch(err => {
    console.log('Error in processing', err);
})
.then(() => {
    if (connection) {
    return connection.close();
    }
})
.then(function() {
    console.log('Connection closed');
})
.catch(err => {
    console.log('Error closing connection', err);
});