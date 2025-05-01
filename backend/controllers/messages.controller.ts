import { Request, Response, NextFunction } from 'express';
import createHttpError from "http-errors";
import crypto from "crypto";
import { Model } from 'mongoose';
import User, { IUser } from '../models/User.models';
import Message from '../models/Message.models';

export const SendMess = (req: Request, res: Response) => {
    console.log(req.body)
}

export const GetMess = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { cid }: { cid: string } = (req as any).params;

        if (!cid) {
            throw createHttpError.BadRequest("Conversation id is required")
        }

        const messages = await Message.find({
            conversation: cid
        }).populate("sender", "firstName lastName avatar email activityStatus")
            .populate("conversation");


        if (!messages) {
            throw createHttpError.BadRequest("Unable to fetch messages");
        }

        res.status(200).json({
            messages
        })
    }
    catch (err) {
        next(err)
    }
}