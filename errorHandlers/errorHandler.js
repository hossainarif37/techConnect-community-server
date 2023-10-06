const { ValidationError } = require("./validationError");

const erroHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(400).json({
            success: false,
            error: err.message
        })
    }
    console.error(err.stack)
    res.status(500).json({
        success: false,
        error: 'Internal server error!'
    })
}

module.exports = erroHandler;