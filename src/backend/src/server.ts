import express from "express";
import payload from "payload";
import { config } from "dotenv";

config();

const app = express();

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET || "your-secret-key",
  mongoURL: process.env.MONGODB_URI || "mongodb://localhost/books-cms",
  express: app,
});

// Add CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.listen(3000, async () => {
  console.log("Books CMS running at http://localhost:3000");
});
