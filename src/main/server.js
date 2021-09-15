global.__rootdir = __dirname
const express = require('express')
const root = require('./domain/routes/root.js')
const getBirds = require('./domain/routes/get_birds')
const app = express()
const port = 3000

app.use(express.static(__rootdir + '/ui'))

app.get('/', root)

app.get('/api/get-birds', getBirds)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})