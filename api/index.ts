import express from 'express';
import payload from 'payload';
import { config } from 'dotenv';

config();

// Initialize express
const app = express();

// Initialize Payload
const init = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
    express: app,
  });
}

init();

// Add your CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SERVER_URL);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

export default app;
