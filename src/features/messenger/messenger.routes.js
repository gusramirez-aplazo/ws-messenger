const express = require('express')
const { wsClientFactory } = require('../../lib/ws-client')
const { storeFactory } = require('../../lib/s3-store')
const { s3Factory } = require('../../lib/s3-client')
const router = express.Router()

const s3Client = s3Factory()
const store = storeFactory(s3Client)
const wsClient = wsClientFactory(store)

router.get('/', (req, res) => {
  res.send('Hello World')
})

router.post('/misa', async (req, res) => {
  // const { phone } = req.body

  const status = await wsClient.getState()

  console.log(status)

  try {
    const result = await wsClient.sendMessage('525580444372@c.us', 'hello')

    return res.json({
      result,
      ok: true,
    })
  } catch (error) {
    throw error
  }
})

module.exports = router
