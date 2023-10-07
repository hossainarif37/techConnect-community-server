const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const articleRoutes = require('./routes/article.routes');

require('./config/database')
require('./config/passport')

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//* Session management
const sessionConfig = require('./config/session');
app.set('trust proxy', 1) // trust first proxy
app.use(session(sessionConfig))

//* Passport and Session Intialize
app.use(passport.initialize());
app.use(passport.session());

//* API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/article', articleRoutes);


//* route not  found
app.use((req, res, next) => {
    res.status(404).json({ message: 'route not found' })
})

//* server error
const errorHandler = require('./errorHandlers/errorHandler');
app.use(errorHandler);


module.exports = app;