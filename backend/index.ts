import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
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

database.connect();  // Ensure database connection
app.get("/", (req, res) => {
  res.send("Welcome to WeChat Backend😺");
});

Router(app);         // Setup routes

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
