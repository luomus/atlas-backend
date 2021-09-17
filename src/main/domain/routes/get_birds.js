const Promise = require('bluebird')
const birdDao = require(__rootdir + "/dao/bird_dao.js")
const bird_table = require(__rootdir + '/dao/species_table.js')

function getBirds (req, res) {
    const dao = new birdDao(__rootdir + '/birds.db')
    const table = new bird_table(dao)

    res.send(table.getById(1))
}

module.exports = getBirds