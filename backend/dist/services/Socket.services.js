"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMess = exports.joinConver = exports.emitStatus = void 0;
const getAllConver_services_1 = __importDefault(require("./getAllConver.services"));
const http_errors_1 = __importDefault(require("http-errors"));
const Conversation_models_1 = __importDefault(require("../models/Conversation.models"));
const Message_models_1 = __importDefault(require("../models/Message.models"));
const cloudinary_utils_1 = __importDefault(require("../utils/cloudinary.utils"));
const emitStatus = async (io, socket, user, onlineStatus) => {
    try {
        user.friends.forEach((fid) => {
            const id = fid.toString();
            io.to(id).emit("online_friends", {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                onlineStatus: onlineStatus,
            });
        });
    }
    catch (error) {
    }
};
exports.emitStatus = emitStatus;
const joinConver = async (socket, _id) => {
    try {
        const conversations = await (0, getAllConver_services_1.default)(_id);
        conversations.map(conv => {
            socket.join(conv._id.toString());
        });
    }
    catch (err) {
    }
};
exports.joinConver = joinConver;
const sendMess = async (socket, user_id, data) => {
    try {
        let { _id, sender, conversation, message, files } = data;
        if (!conversation._id && (!message || !files)) {
            throw http_errors_1.default.BadRequest("Invalid conversation id or message");
        }
        const existConver = await Conversation_models_1.default.findById(conversation._id);
        if (!existConver) {
            throw http_errors_1.default.NotFound("Conversation does not exist");
        }
        if (data.fileData) {
            files = await Promise.all(data.fileData.map(async (f) => {
                return { url: await (0, cloudinary_utils_1.default)(f), isImage: f.isImage };
            }));
        }
        const msgData = {
            _id: _id,
            sender: user_id,
            message,
            conversation: conversation._id,
            files: files || [],
        };
        const newMess = await Message_models_1.default.create(msgData);
        if (!newMess) {
            throw http_errors_1.default.BadRequest("Unable to create new message");
        }
        existConver.latestMessage = newMess.id;
        await existConver.save();
        const populatedMess = await Message_models_1.default.findById(newMess.id)
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
                        select: "firstName lastName avatar email activityStatus onlineStatus",
                        model: "User",
                    }
                }
            ]
        });
        if (!populatedMess) {
            throw http_errors_1.default.BadRequest("Unable to populate message");
        }
        if (populatedMess && (!populatedMess.message || populatedMess.message.trim() === "")) {
            if (populatedMess.files?.length > 0) {
                const hasImage = populatedMess.files.some((f) => f.isImage);
                const hasFile = populatedMess.files.some((f) => !f.isImage);
                if (hasImage && hasFile) {
                    populatedMess.conversation.latestMessage.message = "Sent file(s) and photo(s)";
                }
                else if (hasImage) {
                    populatedMess.conversation.latestMessage.message = `Sent ${populatedMess.files.length} photo(s)`;
                }
                else if (hasFile) {
                    populatedMess.conversation.latestMessage.message = `Sent ${populatedMess.files.length} file(s)`;
                }
            }
        }
        return populatedMess;
    }
    catch (error) {
        console.log(error);
        socket.errorHandler(error.message);
    }
};
exports.sendMess = sendMess;
//# sourceMappingURL=Socket.services.js.map