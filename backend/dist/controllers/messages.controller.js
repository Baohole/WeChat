"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMess = exports.SendMess = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const Message_models_1 = __importDefault(require("../models/Message.models"));
const SendMess = (req, res) => {
    console.log(req.body);
};
exports.SendMess = SendMess;
const GetMess = async (req, res, next) => {
    try {
        const { cid } = req.params;
        if (!cid) {
            throw http_errors_1.default.BadRequest("Conversation id is required");
        }
        const messages = await Message_models_1.default.find({
            conversation: cid
        }).populate("sender", "firstName lastName avatar email activityStatus")
            .populate("conversation");
        if (!messages) {
            throw http_errors_1.default.BadRequest("Unable to fetch messages");
        }
        res.status(200).json({
            messages
        });
    }
    catch (err) {
        next(err);
    }
};
exports.GetMess = GetMess;
//# sourceMappingURL=messages.controller.js.map