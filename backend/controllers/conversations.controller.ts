import createHttpError from "http-errors";
import { Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";

import User from '../models/User.models';
import Conversation from "../models/Conversation.models";

import AuthenticatedRequest from '../interface/request.inf';
import getAllConversations from "../services/getAllConver.services";
import e from "cors";

export const createOpenConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const u = (req as AuthenticatedRequest).user
        const { receiver_id }: { receiver_id: string } = req.body;

        if (!receiver_id) {
            throw createHttpError.BadRequest("Something went wrong");
        }
        const receiver = await User.findById(receiver_id).select('-password');
        if (!receiver) {
            throw createHttpError.NotFound("Verified Receiver does not exist");
        }

        let existConvo;
        if (receiver_id === u._id.toString()) {
            existConvo = await Conversation.findOne({
                users: { $all: [u._id], $size: 1 },
                isGroup: false,
            });
        }
        else {
            existConvo = await Conversation.findOne({
                $and: [
                    { users: { $elemMatch: { $eq: u._id } } },
                    { users: { $elemMatch: { $eq: receiver_id } } },
                ],
                isGroup: false,
            })
        }
        const isValidFriendShip: boolean = (receiver.friends.includes(u._id) && u.friends.includes(receiver.id))

        if (!isValidFriendShip) {
            throw createHttpError.Forbidden("You are not friends with this user");
        }
        // console.log(existConvo)
        if (existConvo) {
            await existConvo.populate("users", "-verified -password -passwordChangedAt -friends")

            res.status(200).json({
                status: "success",
                conversation: existConvo,
                isValidFriendShip,
            });
        }
        else {
            let convo: object = {
                name: `${receiver.firstName} ${receiver.lastName}`,
                isGroup: false,
                users: [u._id, receiver_id]
            }

            const newConvo = new Conversation(convo);
            await newConvo.save();
            res.status(200).json({
                status: "success",
                conversation: convo,
                isValidFriendShip,
            });
        }
    } catch (error) {
        next(error);
    }
};

// -------------------------- Get Direct Conversations --------------------------
export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _id = (req as AuthenticatedRequest).user._id;

        const conversations = await getAllConversations(_id)
        res.status(200).json({ status: "success", conversations: conversations });
    } catch (error) {
        next(error);
    }
};