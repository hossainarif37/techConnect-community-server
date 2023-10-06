const MongoStore = require('connect-mongo');
require('dotenv').config();

const session = {
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECTION_URL,
        collectionName: 'sessions'
    }),
    // cookie: {
    //     secure: false, // Set to true for HTTPS
    //     maxAge: 3600000, // Session expires after 1 hour (in milliseconds)
    // },
}

module.exports = session;