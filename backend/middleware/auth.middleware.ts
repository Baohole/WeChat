import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/User.models';

// Mở rộng Request để thêm thuộc tính user
declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(createHttpError.Unauthorized('Authentication required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return next(createHttpError.NotFound('User not found'));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(createHttpError.Unauthorized('Invalid token'));
    }
}; 