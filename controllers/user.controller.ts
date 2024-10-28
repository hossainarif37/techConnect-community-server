import { NextFunction, Request, Response } from "express";

import User from "../models/user.model"

exports.getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        })
    } catch (error) {
        console.log('Get Current User Controller: ', (error as Error).message);
        next(error);
    }
}

//* Get user articles by their ID
exports.getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await User.findById(req.params.userId, { name: 1, profilePicture: 1, followers: 1, following: 1, _id: 0 });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ success: true, user });

    } catch (error) {
        console.log('Get User Profile Controller: ', (error as Error).message);
        next(error);
    }
}


exports.getAllUsers = async (req: Request, res: Response) => {
    try {
        const name = req.query.name;
        let query: any = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        const users = await User.find(query, { name: 1, profilePicture: 1, _id: 1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}