const qrterminal = require('qrcode-terminal')
const { Client, RemoteAuth } = require('whatsapp-web.js')

let wsClient = null

const wsClientFactory = (store) => {
  if (!wsClient) {
    wsClient = new Client({
      authStrategy: new RemoteAuth({
        clientId: 'gram_io_dev',
        store: store,
        backupSyncIntervalMs: 12 * 3600 * 1000,
      }),
      puppeteer: {
        headless: true,
        args: ['--disable-setuid-sandbox', '--unhandled-rejections=strict'],
      },
      webVersionCache: {
        type: 'remote',
        remotePath:
          'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
      },
    })
    wsClient.once('ready', () => {
      console.log('Client is ready!')
    })

    wsClient.on('qr', (qr) => {
      console.log('QR code received:')
      qrterminal.generate(qr, { small: true })
    })

    wsClient.on('remote_session_saved', () => {
      console.log('Session saved!')
    })

    wsClient.initialize()
  }

  return wsClient
}
module.exports = { wsClientFactory }
