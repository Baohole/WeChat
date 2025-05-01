import { Request, Response, NextFunction } from 'express';
import createHttpError from "http-errors";
import mongoose from "mongoose";

import User from '../models/User.models';
import FriendRequest from '../models/FriendRequest.models';

import AuthenticatedRequest from '../interface/request.inf';

export const SendReq = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const sender = (req as AuthenticatedRequest).user;
        const { receiver_id }: { receiver_id: string } = req.body;
        if (!receiver_id) {
            throw createHttpError.BadRequest("Required field: receiver_id");
        }

        if (sender._id.toString() === receiver_id) {
            throw createHttpError.BadRequest("Something went wrong");
        }
        const existRequests = await FriendRequest.findOne({
            sender: sender._id.toString(),
            recipient: receiver_id
        })
        // console.log(sender._id.toString(), req.body, existRequests);
        if (existRequests) {
            throw createHttpError.BadRequest("Friend request already sent");
        }

        const recipient = await User.findOne({
            _id: receiver_id
        });

        if (!recipient) {
            throw createHttpError.NotFound("User does not exisit");
        }

        if (sender.friends.includes(recipient.id) || recipient.friends.includes(sender._id)) {
            throw createHttpError.BadRequest("You are already friends");
        }

        const newReq = new FriendRequest({
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
    } catch (err) {
        next(err)
    }
}

export const GetReq = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const _id = (req as AuthenticatedRequest).user._id
        const friendRequests = await FriendRequest.find({
            recipient: _id
        }).populate("sender", "_id firstName lastName avatar activityStatus email")
        // console.log(requests)
        res.status(200).json({
            status: "success",
            friendRequests
        })
    } catch (error) {
        next(error);
    }
}

export const AccRejcetReq = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { sender_id, action_type }: { sender_id: string, action_type: string } = req.body;
        const user = (req as AuthenticatedRequest).user;

        if (!sender_id || !action_type) {
            throw createHttpError.BadRequest("Something went wrong");
        }

        const request = await FriendRequest.findOne({
            sender: sender_id,
            recipient: user._id.toString()
        });

        if (!request) {
            throw createHttpError.NotFound("Friend request not found");
        }

        await request.deleteOne();
        switch (action_type) {
            case "accept":
                await User.bulkWrite([
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
}

export const GetFriends = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user_id = (req as AuthenticatedRequest).user._id;
        const user = await User.findById(user_id).populate(
            "friends",
            "_id firstName lastName avatar activityStatus onlineStatus email"
        );

        // console.log(user.friends)
        res.status(200).json({
            status: "success",
            friends: user.friends,
        });
    } catch (error) {
        next(error);
    }
}

export const RemoveFriend = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = (req as AuthenticatedRequest).user;
        const _id = user._id;
        const { friend_id }: { friend_id: string } = req.body;

        if (!user.friends.some(friend => friend.toString() === friend_id)) {
            throw createHttpError.NotFound("Friend not found in your friends list");
        }

        if (!friend_id || (friend_id === _id.toString())) {
            throw createHttpError.BadRequest("Something went wrong");
        }

        await User.bulkWrite([
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
    } catch (err) {
        next(err)
    }
}

export const GetSentReq = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const _id = (req as AuthenticatedRequest).user._id
        const sentRequests = await FriendRequest.aggregate([
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
                // Add extra fields
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
        // console.log(sentRequests, 'ok', tmp)
        res.status(200).json({
            status: "success",
            sentRequests
        })
    } catch (error) {
        next(error);
    }
}

export const CancelReq = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // console.log(req.body)
        const { receiver_id }: { receiver_id: string } = req.body;
        const user = (req as AuthenticatedRequest).user;

        if (!receiver_id) {
            throw createHttpError.BadRequest("Something went wrong");
        }

        const request = await FriendRequest.findOne({
            sender: user._id.toString(),
            recipient: receiver_id
        });

        if (!request) {
            throw createHttpError.NotFound("Friend request not found");
        }

        await request.deleteOne();
        res.status(200).json({
            status: "info",
            message: "Friend request canceled",
            receiver_id,
        });
    } catch (err) {
        next(err)
    }

}

export const OnlFriends = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const _id = (req as AuthenticatedRequest).user._id;

        const user = await User.aggregate([
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
                    "friends._id": { $ne: _id }  // <- exclude if friend._id == user._id
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
            { $sort: { "friend.onlineStatus": -1 } }, // online first
            { $limit: 20 },
            {
                $group: {
                    _id: "$_id",
                    friends: { $push: "$friend" }
                }
            }
        ]);

        // const currentUser = user[0];

        // console.log(user[0].friends)
        res.status(200).json({
            status: "success",
            onlineFriends: user[0].friends || [],
        });
    } catch (error) {
        next(error);
    }
}

export const SearchFriends = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const pageSize: number = 10;
        const { search, page }: { search: string, page: string } = req.query as any;
        if (!search) {
            throw createHttpError.BadRequest("Query required");
        }

        const _id = (req as AuthenticatedRequest).user._id;
        const user = await User.findById(_id);
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
        }

        const resutl = await User.find(certirial)
            .select("_id firstName lastName email avatar activityStatus onlineStatus")
            .limit(pageSize)
            .skip(parseInt(page) * pageSize);

        const totalCount = await User.countDocuments(certirial);

        res.status(200).json({
            status: "success",
            usersFound: totalCount,
            friends: resutl,
        });
    }
    catch (err) {
        next(err);
    }
}
