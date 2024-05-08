import { Router } from 'express'
import { s3Factory } from '../../../lib/s3-client.js'
import { storeFactory } from '../../../lib/s3-store.js'
import { wsClientFactory } from '../../../lib/ws-client.js'

const s3Client = s3Factory()
const store = storeFactory(s3Client)
const wsClient = wsClientFactory(store)
const messengerRouter = Router()

messengerRouter.get('/', (req, res) => {
  res.send('Hello World')
})

messengerRouter.post('/misa', async (req, res) => {
  // const { phone } = req.body

  const status = await wsClient.getState()

  console.log(status)

  try {
    // const result = await wsClient.sendMessage('525580444372@c.us', 'hello')

    return res.json({
      result: null,
      ok: true,
    })
  } catch (error) {
    throw error
  }
})

export { messengerRouter }
