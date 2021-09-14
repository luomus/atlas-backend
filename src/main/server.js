const express = require('express')
const root = require('./domain/root.js')
const app = express()
const port = 3000

app.get('/', root)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})