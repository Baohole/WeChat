import jwt from 'jsonwebtoken';
import createHttpError from "http-errors";
import User from '../models/User.models';
import { NextFunction } from 'express';
import { Socket } from 'socket.io';

const socketMldw = async (socket: Socket, next: NextFunction): Promise<any> => {
    const token = socket.handshake.query.token as string;
    if (!token) {
        return next(createHttpError.Unauthorized("Invalid token, Please login again"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as { userId: string };
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return next(
                createHttpError.Unauthorized("Unidentified User, Please login again")
            );
        }
        (socket as any).user = user;

        next();
    } catch (err) {
        next(createHttpError.Unauthorized("Token verification failed"));
    }

};

export default socketMldw;