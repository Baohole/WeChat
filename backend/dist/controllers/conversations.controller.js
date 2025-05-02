"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversations = exports.createOpenConversation = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const User_models_1 = __importDefault(require("../models/User.models"));
const Conversation_models_1 = __importDefault(require("../models/Conversation.models"));
const getAllConver_services_1 = __importDefault(require("../services/getAllConver.services"));
const createOpenConversation = async (req, res, next) => {
    try {
        const u = req.user;
        const { receiver_id } = req.body;
        if (!receiver_id) {
            throw http_errors_1.default.BadRequest("Something went wrong");
        }
        const receiver = await User_models_1.default.findById(receiver_id).select('-password');
        if (!receiver) {
            throw http_errors_1.default.NotFound("Verified Receiver does not exist");
        }
        let existConvo;
        if (receiver_id === u._id.toString()) {
            existConvo = await Conversation_models_1.default.findOne({
                users: { $all: [u._id], $size: 1 },
                isGroup: false,
            });
        }
        else {
            existConvo = await Conversation_models_1.default.findOne({
                $and: [
                    { users: { $elemMatch: { $eq: u._id } } },
                    { users: { $elemMatch: { $eq: receiver_id } } },
                ],
                isGroup: false,
            });
        }
        const isValidFriendShip = (receiver.friends.includes(u._id) && u.friends.includes(receiver.id));
        if (!isValidFriendShip) {
            throw http_errors_1.default.Forbidden("You are not friends with this user");
        }
        if (existConvo) {
            await existConvo.populate("users", "-verified -password -passwordChangedAt -friends");
            res.status(200).json({
                status: "success",
                conversation: existConvo,
                isValidFriendShip,
            });
        }
        else {
            let convo = {
                name: `${receiver.firstName} ${receiver.lastName}`,
                isGroup: false,
                users: [u._id, receiver_id]
            };
            const newConvo = new Conversation_models_1.default(convo);
            await newConvo.save();
            res.status(200).json({
                status: "success",
                conversation: convo,
                isValidFriendShip,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.createOpenConversation = createOpenConversation;
const getConversations = async (req, res, next) => {
    try {
        const _id = req.user._id;
        const conversations = await (0, getAllConver_services_1.default)(_id);
        res.status(200).json({ status: "success", conversations: conversations });
    }
    catch (error) {
        next(error);
    }
};
exports.getConversations = getConversations;
//# sourceMappingURL=conversations.controller.js.map