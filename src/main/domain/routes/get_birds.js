const birdDao = require(__rootdir + "/dao/bird_dao.js")

function getBirds (req, res) {
    res.send(birdDao.getBirds())
}

module.exports = getBirds