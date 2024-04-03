import { NextFunction, Request, Response } from "express";

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const articleRoutes = require('./routes/article.routes');
const commentRoutes = require('./routes/comment.routes');

require('./config/database')
require('./config/passport')

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, "http://localhost:3000"] : "http://localhost:3000" || '*'
}));
app.use(express.urlencoded({ extended: true }));



//* Passport and Session Intialize
app.use(passport.initialize());

//* home route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to TechConnect Community server')
})

//* API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/posts', articleRoutes);
app.use('/api/v1/comments', commentRoutes);


//* route not  found
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ success: false, message: 'route not found' })
})

//* server error
const errorHandler = require('./errorHandlers/errorHandler');
app.use(errorHandler);


module.exports = app;