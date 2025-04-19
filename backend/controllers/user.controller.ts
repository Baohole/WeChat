import { Request, Response, NextFunction } from 'express';
import createHttpError from "http-errors";

import User from '../models/User.models';

export const FindUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (req.query) {
        let { search = "", page = "" } = req.query as { search?: string; page?: string };
        let pagination: {
            limitItems: number,
            currentPage: number,
            skip: number
        } = {
            limitItems: 7,
            currentPage: parseInt(page),
            skip: 0
        }

        pagination.skip = (pagination.currentPage) * pagination.limitItems

        const regex = new RegExp(search, 'i');
        const objFind = {
            $or: [
                { firstName: regex },
                { lastName: regex },
                { email: regex }
            ]
        };
        try {
            let users = await User.find(objFind)
                .limit(pagination.limitItems)
                .skip(pagination.skip).select('-password');
            res.status(200).json({
                users
            })
        } catch (err) {
            throw createHttpError.InternalServerError("Cannot find");
        }

    }
    next();
}

export const GetUserData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let { userId = "" } = req.query as { userId?: string };
        if (userId === "") {
            throw createHttpError.BadRequest("Something went wrong");
        }

        const userData = await User.findOne({
            _id: userId
        }).select("-password -passwordChangedAt -verified -friends")
        res.status(200).json({
            status: "success",
            userData: userData,
        });
    } catch (err) {
        next(err)
    }
}