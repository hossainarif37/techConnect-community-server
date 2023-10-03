const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//* home route
app.get('/', (req, res) => {
    res.send('Welcome to the server')
})

//* route not  found
app.use((req, res, next) => {
    res.json({ message: 'route not found' })
})

//* server error
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong!')
})


module.exports = app;