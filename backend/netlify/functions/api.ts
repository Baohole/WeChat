import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

// Import database and router
import Router from '../../routes/index.routes';
import * as database from '../../config/database';

// Configure environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();

// Configure middleware
app.use(cors({
    origin: process.env.FE_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'auth-token']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('612Gasd0q'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 604800000, // 7 days
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Connect to database
database.connect();

// Root route
app.get("/api", (req, res) => {
    res.json({ message: "Welcome to WeChat Backend API 😺" });
});

// Setup API routes
Router(app);

// Setup 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Configure serverless handler
const handler = serverless(app);

// Export the serverless handler
export { handler }; 