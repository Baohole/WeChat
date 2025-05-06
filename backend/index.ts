import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import helmet from "helmet";
// @ts-ignore
import { xss } from "express-xss-sanitizer";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';

import { initSocketServer } from './socket';

const app: Express = express();
const server = http.createServer(app);
initSocketServer(server);
dotenv.config()

const port: number | string = process.env.PORT || 8000;

// Import database and router if needed
import Router from './routes/index.routes';
import * as database from './config/database';

app.use(cors({ origin: process.env.FE_URL, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser('612Gasd0q'));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 6000 }
}));

const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000, // in 1 hour
  message: "Too many requests was made, please try again after 1 hour",
});
app.use("/", limiter); // limits rates of requests
app.use(helmet()); // general security
app.use(xss()); // xss protection
app.use(mongoSanitize()); // sanitization for mongodb
app.use(cookieParser()); // parsing cookies
app.use(compression()); // gzip compression


database.connect();  // Ensure database connection
app.get("/", (req, res) => {
  res.send("Welcome to WeChat Backend😺");
});

Router(app);         // Setup routes

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


const exitHandler = () => {
  if (server) {
    console.log("Closing Server...");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  console.log(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// SIGTERM Handling - (works for deployed linux based server)
process.on("SIGTERM", () => {
  if (server) {
    console.log("Closing Server...");
    process.exit(1);
  }
});
