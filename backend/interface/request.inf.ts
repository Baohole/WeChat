import mongoose from "mongoose";
import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        _id: mongoose.Types.ObjectId;
        friends: [{ type: mongoose.Schema.Types.ObjectId }],
        firstName: string,
        lastName: string
        // Add other user properties you need
    }

}

export default AuthenticatedRequest;