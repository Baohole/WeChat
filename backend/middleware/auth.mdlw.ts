import { Request, Response, NextFunction } from 'express';
import createHttpError from "http-errors";
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User.models';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        else if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return next(createHttpError.Unauthorized("Please login first"))
        }

        const decode = await jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JwtPayload
        const user = await User.findOne({
            _id: decode.userId,
        }).select('-password');

        if (!user) {
            return next(
                createHttpError.Unauthorized("Unidentified User, Please login again")
            );
        }
        (req as any).user = user;
    } catch (error) {
        return next(
            createHttpError.Unauthorized("Invalid token, Please login again")
        );
    }
    next();
}