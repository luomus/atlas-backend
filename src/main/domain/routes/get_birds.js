const bird_dao = require(__rootdir + '/dao/bird_dao.js')

async function getBirds (req, res) {
    const table = new bird_dao(__rootdir + '/birds.db')
    table.getAll().then(function(fromResolve) {
        res.send(fromResolve)
    }, function(fromReject) {
        res.send(null)
    })
}

module.exports = getBirds