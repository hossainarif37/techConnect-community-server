const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config();

mongoose
    .connect(process.env.DB_CONNECTION_URL)
    .then(() => {
        console.log(colors.blue('Database Connected'));
    })
    .catch((error: any) => {
        console.log((error as Error).message);
    })
