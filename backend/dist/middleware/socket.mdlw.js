"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const User_models_1 = __importDefault(require("../models/User.models"));
const socketMldw = async (socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
        return next(http_errors_1.default.Unauthorized("Invalid token, Please login again"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User_models_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            return next(http_errors_1.default.Unauthorized("Unidentified User, Please login again"));
        }
        socket.user = user;
        next();
    }
    catch (err) {
        next(http_errors_1.default.Unauthorized("Token verification failed"));
    }
};
exports.default = socketMldw;
//# sourceMappingURL=socket.mdlw.js.map