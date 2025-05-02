"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const User_models_1 = __importDefault(require("../models/User.models"));
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(http_errors_1.default.Unauthorized('Authentication required'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_models_1.default.findById(decoded.id).select('-password');
        if (!user) {
            return next(http_errors_1.default.NotFound('User not found'));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(http_errors_1.default.Unauthorized('Invalid token'));
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map