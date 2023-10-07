const errorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        const erroMessage = err.message.replace(/(?<=: )\w+: /, "");
        return res.status(400).json({ success: false, error: erroMessage });
    }
    else if (err.name === 'CastError') {
        return res.status(400).json({ error: err.message })
    }
    res.status(500).json({
        success: false,
        error: 'Internal server error!'
    })
}

module.exports = errorHandler;