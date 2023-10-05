const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
require('./config/database')
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


//* API Routes
app.use('/api/auth', authRoutes);


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