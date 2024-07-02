import qrterminal from 'qrcode-terminal';
import wsPckg from 'whatsapp-web.js';
import { AwsS3Store } from 'wwebjs-aws-s3';

/**
 * @type {wsPckg.Client | null}
 */
let wsClient = null;

/**
 *
 * @param {typeof AwsS3Store | null} store
 * @returns
 */
export const wsClientFactory = (store) => {
  if (!wsClient) {
    wsClient = new wsPckg.Client({
      authStrategy: new wsPckg.RemoteAuth({
        clientId: 'gram_io_dev',
        store: store,
        backupSyncIntervalMs: 12 * 3600 * 1000,
      }),
      puppeteer: {
        headless: true,
        args: ['--disable-setuid-sandbox', '--unhandled-rejections=strict'],
      },

    });
    wsClient.once('ready', () => {
      console.log('Client is ready!');
    });

    wsClient.on('qr', (qr) => {
      console.log('QR code received:');
      qrterminal.generate(qr, { small: true });
    });

    wsClient.on('remote_session_saved', () => {
      console.log('Session saved!');
    });

    wsClient.initialize();
  }

  return wsClient;
};
