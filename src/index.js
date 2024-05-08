const express = require('express')
const cors = require('cors')

const port = process.env.PORT || 8000

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api/v1/messenger', require('./features/messenger/messenger.routes'))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`Listen on port: ${port}`)
})

process.on('uncaughtException', (err) => {
  console.error(err)
  process.exit(1)
})
