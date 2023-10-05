require('dotenv').config();
const app = require('./app');


const port = process.env.PORT || 5000

//* home route
app.get('/', (req, res) => {
    res.send('Welcome to the server')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})