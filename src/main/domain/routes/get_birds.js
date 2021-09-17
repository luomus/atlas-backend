const Promise = require('bluebird')
const birdDao = require(__rootdir + "/dao/bird_dao.js")
const bird_table = require(__rootdir + '/dao/species_table.js')

async function getBirds (req, res) {
    const dao = new birdDao(__rootdir + '/birds.db')
    const table = new bird_table(dao)
    table.getAll().then(function(fromResolve) {
        res.send(fromResolve)
    }, function(fromReject) {
        res.send(null)
    })
}

module.exports = getBirds