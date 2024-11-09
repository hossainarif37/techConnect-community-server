import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";
const passport = require('passport');

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, async (err: any, user: IUser) => {
        if (err || !user) {
            return res.status(401).json({ success: false, message: 'Unauthorized access' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

module.exports = {
    checkAuth
}