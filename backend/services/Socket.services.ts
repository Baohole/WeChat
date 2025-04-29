import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import getAllConversations from "./getAllConver.services";
import createHttpError from "http-errors";
import Conversation from "../models/Conversation.models";
import Message from "../models/Message.models";

export const emitStatus = async (io: Server, socket: Socket, user: any, onlineStatus: string) => {
    try {
        // console.log(user.friends)
        user.friends.forEach((fid: mongoose.Types.ObjectId) => {
            const id = fid.toString();
            io.to(id).emit("online_friends", {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                onlineStatus: onlineStatus,
            })
        });
    } catch (error) {
        // socket.errorHandler("Online friends error");

    }
}

export const joinConver = async (socket: Socket, _id: mongoose.Types.ObjectId) => {
    try {
        const conversations = await getAllConversations(_id);
        conversations.map(conv => {
            socket.join(conv._id.toString())
        })
    } catch (err) {
        // socket.errorHandler("Join convo error");
    }
}

export const sendMess = async (socket: Socket, user_id: any, data: any) => {
    try {
        const { _id, sender, conversation, message, files } = data;
        if (!conversation._id || !message || !files) {
            throw createHttpError.BadRequest("Invalid conversation id or message")
        }

        const existConver = await Conversation.findById(conversation._id);
        if (!existConver) {
            throw createHttpError.NotFound("Conversation does not exist");
        }

        const msgData = {
            _id: _id,
            sender: user_id,
            message,
            conversation: conversation._id,
            files: files || [],
        };

        const newMess = await Message.create(msgData);
        if (!newMess) {
            throw createHttpError.BadRequest("Unable to create new message");
        }

        existConver.latestMessage = newMess.id;
        await existConver.save();

        const populatedMess = await Message.findById(newMess.id)
            .populate({
                path: "sender",
                select: "firstName lastName avatar",
                model: "User"
            }).populate({
                path: "conversation",
                select: "name picture isGroup users latestMessage",
                model: "Conversation",
                populate: [{
                    path: "users",
                    select: "_id firstName lastName avatar email activityStatus onlineStatus",
                    model: "User"
                },
                {
                    path: "latestMessage",
                    model: "Message",
                    populate: {
                        path: "sender",
                        select:
                            "firstName lastName avatar email activityStatus onlineStatus",
                        model: "User",
                    }
                }
                ]
            })
        if (!populatedMess) {
            throw createHttpError.BadRequest("Unable to populate message");
        }
        return populatedMess;
    } catch (error) {
        console.log(error);
        (socket as any).errorHandler(error.message);
    }
}