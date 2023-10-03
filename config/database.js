const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config();

mongoose
    .connect(process.env.DB_CONNECTION_URL)
    .then(() => {
        console.log('Database Connected'.blue);
    })
    .catch(err => {
        console.log(err.message);
    })
