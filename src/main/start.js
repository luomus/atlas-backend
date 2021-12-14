const app = require('./server.js')
const port = 3000

app.listen(port, () => {
  console.log(`Atlas app listening at http://localhost:${port}`)
})
