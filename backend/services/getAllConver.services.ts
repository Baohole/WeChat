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
        .then(async (results: Array<any>) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "firstName lastName avatar email activityStatus onlineStatus",
            });

            conversations = results.map((convo: any) => {
                const lm = convo.latestMessage;

                if (lm && (!lm.message || lm.message.trim() === "")) {
                    if (lm.files?.length > 0) {
                        const hasImage = lm.files.some((f: any) => f.isImage);
                        const hasFile = lm.files.some((f: any) => !f.isImage);

                        if (hasImage && hasFile) {
                            lm.message = "Sent file(s) and photo(s)";
                        } else if (hasImage) {
                            lm.message = `Sent ${lm.files.length} photo(s)`;
                        } else if (hasFile) {
                            lm.message = `Sent ${lm.files.length} file(s)`;
                        }
                        convo.message = lm.message
                    }
                }

                return convo;
            });
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
