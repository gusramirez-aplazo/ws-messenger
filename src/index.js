import cors from 'cors';
import express from 'express';
import { messengerRouter } from './features/messenger/routes/index.js';
import { s3Factory } from './lib/s3-client.js';

const s3Client = s3Factory();

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/v1/messenger', messengerRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Listen on port: ${port}`);
});

process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('(SIGINT) Shutting down...');
  await s3Client.destroy();
  console.log('client destroyed');
  process.exit(0);
});
