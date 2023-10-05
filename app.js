const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
require('./config/database')
require('./config/passport')
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//* Session management
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECTION_URL,
        collectionName: 'sessions'
    })
    // cookie: { secure: true }
}))
//* Passport and Session Intialize
app.use(passport.initialize());
app.use(passport.session());

//* API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);


//* route not  found
app.use((req, res, next) => {
    res.json({ message: 'route not found' })
})

//* server error
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Name, Email and Password field are required'
        })
    }
    console.error(err.stack)
    res.status(500).json({
        success: false,
        error: 'Internal server error!'
    })
})


module.exports = app;