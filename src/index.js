import cors from 'cors';
import express from 'express';
import { messengerRouter } from './features/messenger/routes/index.js';

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
