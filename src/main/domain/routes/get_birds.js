const birdDao = require(__rootdir + '/dao/bird_dao.js')

async function getBirds (req, res) {
    birdDao.getAll().then(data => res.send(data), () => res.send(null))
}

module.exports = getBirds