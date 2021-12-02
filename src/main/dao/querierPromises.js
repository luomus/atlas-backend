const oracledb = require('oracledb')
const fs = require('fs');
const { connect } = require('superagent');

const pass = fs.readFileSync("pass.txt")
const pw = pass.toString()

const dbConfig = {
    user : "atlas_staging",
            password : pw,
            connectString : "oracle.luomus.fi:1521/oracle.luomus.fi"
            };

let connection;

function Querier() {

    return (methodName, query, params = []) => {

    oracledb.getConnection(dbConfig).then(function(c) {
        console.log('Connected to Oracle database');
        connection = c;

        return connection.execute(query, params, { outFormat: oracledb.OUT_FORMAT_OBJECT});
    })
    .then(result => {
        console.log('Query executed');
        console.log(result.rows.length);
        return correctMxFormating(rows)
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
    }
}

   

function correctMxFormating(data) {
    for (const val in data) {
        if (data[val].hasOwnProperty('species_mxcode')) {
            data[val].species_id = "MX." + data[val].species_mxcode
            delete data[val].species_mxcode
            }
        if (data[val].hasOwnProperty('mxCode')) {
            data[val].species_id = "MX." + data[val].mxCode
            delete data[val].mxCode
        }
    }
}

module.exports = Querier







