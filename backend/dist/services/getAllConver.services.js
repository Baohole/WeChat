"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const User_models_1 = __importDefault(require("../models/User.models"));
const Conversation_models_1 = __importDefault(require("../models/Conversation.models"));
const getAllConversations = async (_id) => {
    let conversations;
    await Conversation_models_1.default.find({
        users: { $elemMatch: { $eq: _id } },
    })
        .populate("users", "-verified -password -passwordChangedAt -friends")
        .populate("admin", "-verified -password -passwordChangedAt -friends")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
        results = await User_models_1.default.populate(results, {
            path: "latestMessage.sender",
            select: "firstName lastName avatar email activityStatus onlineStatus",
        });
        conversations = results.map((convo) => {
            const lm = convo.latestMessage;
            if (lm && (!lm.message || lm.message.trim() === "")) {
                if (lm.files?.length > 0) {
                    const hasImage = lm.files.some((f) => f.isImage);
                    const hasFile = lm.files.some((f) => !f.isImage);
                    if (hasImage && hasFile) {
                        lm.message = "Sent file(s) and photo(s)";
                    }
                    else if (hasImage) {
                        lm.message = `Sent ${lm.files.length} photo(s)`;
                    }
                    else if (hasFile) {
                        lm.message = `Sent ${lm.files.length} file(s)`;
                    }
                    convo.message = lm.message;
                }
            }
            return convo;
        });
    })
        .catch((err) => {
        throw http_errors_1.default.BadRequest("Error fetching conversations, try again");
    });
    return conversations || [];
};
exports.default = getAllConversations;
//# sourceMappingURL=getAllConver.services.js.map