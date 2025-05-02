"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchFriends = exports.OnlFriends = exports.CancelReq = exports.GetSentReq = exports.RemoveFriend = exports.GetFriends = exports.AccRejcetReq = exports.GetReq = exports.SendReq = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const User_models_1 = __importDefault(require("../models/User.models"));
const FriendRequest_models_1 = __importDefault(require("../models/FriendRequest.models"));
const SendReq = async (req, res, next) => {
    try {
        const sender = req.user;
        const { receiver_id } = req.body;
        if (!receiver_id) {
            throw http_errors_1.default.BadRequest("Required field: receiver_id");
        }
        if (sender._id.toString() === receiver_id) {
            throw http_errors_1.default.BadRequest("Something went wrong");
        }
        const existRequests = await FriendRequest_models_1.default.findOne({
            sender: sender._id.toString(),
            recipient: receiver_id
        });
        if (existRequests) {
            throw http_errors_1.default.BadRequest("Friend request already sent");
        }
        const recipient = await User_models_1.default.findOne({
            _id: receiver_id
        });
        if (!recipient) {
            throw http_errors_1.default.NotFound("User does not exisit");
        }
        if (sender.friends.includes(recipient.id) || recipient.friends.includes(sender._id)) {
            throw http_errors_1.default.BadRequest("You are already friends");
        }
        const newReq = new FriendRequest_models_1.default({
            sender: sender._id.toString(),
            recipient: receiver_id
        });
        await newReq.save();
        res.status(200).json({
            status: "success",
            message: "Friend request sent successfully",
            sender: {
                _id: sender._id,
                firstName: sender.firstName,
                lastName: sender.lastName,
            },
            receiver: {
                _id: recipient._id,
                firstName: recipient.firstName,
                lastName: recipient.lastName,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.SendReq = SendReq;
const GetReq = async (req, res, next) => {
    try {
        const _id = req.user._id;
        const friendRequests = await FriendRequest_models_1.default.find({
            recipient: _id
        }).populate("sender", "_id firstName lastName avatar activityStatus email");
        res.status(200).json({
            status: "success",
            friendRequests
        });
    }
    catch (error) {
        next(error);
    }
};
exports.GetReq = GetReq;
const AccRejcetReq = async (req, res, next) => {
    try {
        const { sender_id, action_type } = req.body;
        const user = req.user;
        if (!sender_id || !action_type) {
            throw http_errors_1.default.BadRequest("Something went wrong");
        }
        const request = await FriendRequest_models_1.default.findOne({
            sender: sender_id,
            recipient: user._id.toString()
        });
        if (!request) {
            throw http_errors_1.default.NotFound("Friend request not found");
        }
        await request.deleteOne();
        switch (action_type) {
            case "accept":
                await User_models_1.default.bulkWrite([
                    {
                        updateOne: {
                            filter: { _id: user._id },
                            update: { $push: { friends: sender_id } }
                        }
                    },
                    {
                        updateOne: {
                            filter: { _id: sender_id },
                            update: { $push: { friends: user._id } }
                        }
                    }
                ]);
                res.status(200).json({
                    status: "success",
                    message: "Friend request accepted",
                    sender_id,
                });
                break;
            case "reject":
                res.status(200).json({
                    status: "info",
                    message: "Friend request rejected",
                    sender_id,
                });
                break;
            default:
                break;
        }
    }
    catch (err) {
        next(err);
    }
};
exports.AccRejcetReq = AccRejcetReq;
const GetFriends = async (req, res, next) => {
    try {
        const user_id = req.user._id;
        const user = await User_models_1.default.findById(user_id).populate("friends", "_id firstName lastName avatar activityStatus onlineStatus email");
        res.status(200).json({
            status: "success",
            friends: user.friends,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.GetFriends = GetFriends;
const RemoveFriend = async (req, res, next) => {
    try {
        const user = req.user;
        const _id = user._id;
        const { friend_id } = req.body;
        if (!user.friends.some(friend => friend.toString() === friend_id)) {
            throw http_errors_1.default.NotFound("Friend not found in your friends list");
        }
        if (!friend_id || (friend_id === _id.toString())) {
            throw http_errors_1.default.BadRequest("Something went wrong");
        }
        await User_models_1.default.bulkWrite([
            {
                updateOne: {
                    filter: { _id: _id },
                    update: { $pull: { friends: friend_id } }
                }
            },
            {
                updateOne: {
                    filter: { _id: friend_id },
                    update: { $pull: { friends: _id } }
                }
            }
        ]);
        res.status(200).json({
            status: "success",
            message: "Friend removed successfully",
            friend_id: friend_id,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.RemoveFriend = RemoveFriend;
const GetSentReq = async (req, res, next) => {
    try {
        const _id = req.user._id;
        const sentRequests = await FriendRequest_models_1.default.aggregate([
            {
                $match: { sender: _id },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "recipient",
                    foreignField: "_id",
                    as: "recipient",
                },
            },
            { $unwind: "$recipient" },
            {
                $addFields: {
                    "recipient.isSent": true,
                    "recipient.receiver_id": "$recipient._id",
                },
            },
            {
                $project: {
                    _id: "$recipient._id",
                    firstName: "$recipient.firstName",
                    lastName: "$recipient.lastName",
                    avatar: "$recipient.avatar",
                    activityStatus: "$recipient.activityStatus",
                    email: "$recipient.email",
                    isSent: "$recipient.isSent",
                    receiverId: "$recipient.receiver_id",
                },
            },
        ]);
        res.status(200).json({
            status: "success",
            sentRequests
        });
    }
    catch (error) {
        next(error);
    }
};
exports.GetSentReq = GetSentReq;
const CancelReq = async (req, res, next) => {
    try {
        const { receiver_id } = req.body;
        const user = req.user;
        if (!receiver_id) {
            throw http_errors_1.default.BadRequest("Something went wrong");
        }
        const request = await FriendRequest_models_1.default.findOne({
            sender: user._id.toString(),
            recipient: receiver_id
        });
        if (!request) {
            throw http_errors_1.default.NotFound("Friend request not found");
        }
        await request.deleteOne();
        res.status(200).json({
            status: "info",
            message: "Friend request canceled",
            receiver_id,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.CancelReq = CancelReq;
const OnlFriends = async (req, res, next) => {
    try {
        const _id = req.user._id;
        const user = await User_models_1.default.aggregate([
            { $match: { _id: _id } },
            {
                $lookup: {
                    from: "users",
                    localField: "friends",
                    foreignField: "_id",
                    as: "friends"
                }
            },
            { $unwind: "$friends" },
            {
                $match: {
                    "friends._id": { $ne: _id }
                }
            },
            {
                $project: {
                    friend: {
                        _id: "$friends._id",
                        firstName: "$friends.firstName",
                        lastName: "$friends.lastName",
                        onlineStatus: "$friends.onlineStatus",
                        avatar: "$friends.avatar"
                    }
                }
            },
            { $sort: { "friend.onlineStatus": -1 } },
            { $limit: 20 },
            {
                $group: {
                    _id: "$_id",
                    friends: { $push: "$friend" }
                }
            }
        ]);
        res.status(200).json({
            status: "success",
            onlineFriends: user[0].friends || [],
        });
    }
    catch (error) {
        next(error);
    }
};
exports.OnlFriends = OnlFriends;
const SearchFriends = async (req, res, next) => {
    try {
        const pageSize = 10;
        const { search, page } = req.query;
        if (!search) {
            throw http_errors_1.default.BadRequest("Query required");
        }
        const _id = req.user._id;
        const user = await User_models_1.default.findById(_id);
        const regex = new RegExp(search, 'i');
        const certirial = {
            _id: { $in: user.friends },
            $or: [{
                    $or: [{
                            firstName: regex
                        },
                        {
                            lastName: regex
                        }, {
                            email: regex
                        }, {
                            $expr: {
                                $regexMatch: {
                                    input: { $concat: ["$firstName", " ", "$lastName"] },
                                    regex: regex,
                                },
                            }
                        }]
                }]
        };
        const resutl = await User_models_1.default.find(certirial)
            .select("_id firstName lastName email avatar activityStatus onlineStatus")
            .limit(pageSize)
            .skip(parseInt(page) * pageSize);
        const totalCount = await User_models_1.default.countDocuments(certirial);
        res.status(200).json({
            status: "success",
            usersFound: totalCount,
            friends: resutl,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.SearchFriends = SearchFriends;
//# sourceMappingURL=friends.controller.js.map