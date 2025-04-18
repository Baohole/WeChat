import { Request, Response, NextFunction } from 'express';
import createHttpError from "http-errors";
import crypto from "crypto";
import { Model } from 'mongoose';
import User, { IUser } from '../models/User.models';

export const SendMess = (req: Request, res: Response) => {
    console.log(req.body)
}
