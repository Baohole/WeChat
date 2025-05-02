"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_models_1 = __importDefault(require("../models/User.models"));
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        else if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        if (!token) {
            return next(http_errors_1.default.Unauthorized("Please login first"));
        }
        const decode = await jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User_models_1.default.findOne({
            _id: decode.userId,
        }).select('-password');
        if (!user) {
            return next(http_errors_1.default.Unauthorized("Unidentified User, Please login again"));
        }
        req.user = user;
    }
    catch (error) {
        return next(http_errors_1.default.Unauthorized("Invalid token, Please login again"));
    }
    next();
};
exports.protect = protect;
//# sourceMappingURL=auth.mdlw.js.map