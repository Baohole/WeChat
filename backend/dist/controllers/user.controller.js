"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserData = exports.FindUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const User_models_1 = __importDefault(require("../models/User.models"));
const FindUser = async (req, res, next) => {
    if (req.query) {
        let { search = "", page = "" } = req.query;
        let pagination = {
            limitItems: 7,
            currentPage: parseInt(page),
            skip: 0
        };
        pagination.skip = (pagination.currentPage) * pagination.limitItems;
        const regex = new RegExp(search, 'i');
        const objFind = {
            $or: [
                { firstName: regex },
                { lastName: regex },
                { email: regex }
            ]
        };
        try {
            let users = await User_models_1.default.find(objFind)
                .limit(pagination.limitItems)
                .skip(pagination.skip).select('-password');
            res.status(200).json({
                users
            });
        }
        catch (err) {
            throw http_errors_1.default.InternalServerError("Cannot find");
        }
    }
    next();
};
exports.FindUser = FindUser;
const GetUserData = async (req, res, next) => {
    try {
        let { userId = "" } = req.query;
        if (userId === "") {
            throw http_errors_1.default.BadRequest("Something went wrong");
        }
        const userData = await User_models_1.default.findOne({
            _id: userId
        }).select("-password -passwordChangedAt -verified -friends");
        res.status(200).json({
            status: "success",
            userData: userData,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.GetUserData = GetUserData;
//# sourceMappingURL=user.controller.js.map