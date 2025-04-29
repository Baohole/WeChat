import createHttpError from "http-errors";
import User from '../models/User.models';
import Conversation from "../models/Conversation.models";
import mongoose from "mongoose";


const getAllConversations = async (_id: mongoose.Types.ObjectId): Promise<Array<any>> => {
    let conversations;
    await Conversation.find({
        users: { $elemMatch: { $eq: _id } },
    })
        .populate("users", "-verified -password -passwordChangedAt -friends")
        .populate("admin", "-verified -password -passwordChangedAt -friends")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results: any) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "firstName lastName avatar email activityStatus onlineStatus",
            });
            conversations = results;
            // console.log(conversations)
        })
        .catch((err) => {
            throw createHttpError.BadRequest(
                "Error fetching conversations, try again"
            );
        });
    return conversations || []
}

export default getAllConversations
