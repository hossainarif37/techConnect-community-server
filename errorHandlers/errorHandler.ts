import { NextFunction, Request, Response } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: err.message });
    }
    else if (err.name === 'CastError') {
        return res.status(400).json({ error: err.message })
    }
    res.status(500).json({
        success: false,
        message: 'Internal server error!'
    })
}

module.exports = errorHandler;