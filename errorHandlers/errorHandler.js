const erroHandler = (err, req, res, next) => {
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
}

module.exports = erroHandler;