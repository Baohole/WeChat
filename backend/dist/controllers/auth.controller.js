"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.SendOtp = exports.ResetPassword = exports.VerifyOtp = exports.ForgotPassword = exports.Register = exports.Login = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const crypto_1 = __importDefault(require("crypto"));
const AuthServ_services_1 = require("../services/AuthServ.services");
const Mailer_services_1 = require("../services/Mailer.services");
const FilterObjs_utils_1 = require("../utils/FilterObjs.utils");
const CreatOtp_utils_1 = require("../utils/CreatOtp.utils");
const reset_1 = __importDefault(require("../mailtemplates/reset"));
const User_models_1 = __importDefault(require("../models/User.models"));
const Otp_models_1 = __importDefault(require("../models/Otp.models"));
const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw http_errors_1.default.BadRequest("Required fields: email & password");
        }
        const user = await User_models_1.default.findOne({ email: email }).select('-password');
        res.status(200).json({
            status: "success",
            message: "Logged in successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                email: user.email,
                activityStatus: user.activityStatus,
                onlineStatus: user.onlineStatus,
                token: await (0, AuthServ_services_1.generateLoginTokens)(user, res),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.Login = Login;
const Register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            throw http_errors_1.default.BadRequest("Required fields: firstName, lastName, email & password");
        }
        const filteredBody = (0, FilterObjs_utils_1.filterObj)(req.body, "firstName", "lastName", "email", "password");
        const user = new User_models_1.default(filteredBody);
        await user.save();
        req.userId = user.id;
        res.status(200).json({
            status: "success",
        });
    }
    catch (error) {
        next(error);
    }
    next();
};
exports.Register = Register;
const ForgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw http_errors_1.default.BadRequest("Required field: email");
        }
        const user = await User_models_1.default.findOne({ email: email });
        if (!user) {
            throw http_errors_1.default.NotFound("Email is not registered");
        }
        const lastResetLinkTime = user.passwordResetLastSent ? new Date(user.passwordResetLastSent).getTime() : null;
        const cooldownPeriod = 90 * 1000;
        if (lastResetLinkTime &&
            Date.now() - lastResetLinkTime < cooldownPeriod) {
            const timeRemaining = Math.ceil((cooldownPeriod - (Date.now() - lastResetLinkTime)) / 1000);
            const remainingTimeString = (0, Mailer_services_1.formatRemainingTime)(timeRemaining);
            throw http_errors_1.default.TooEarly(`Please wait ${remainingTimeString} before requesting a new reset link`);
        }
        user.passwordResetLastSent = new Date(Date.now());
        await user.save();
        const resetToken = await user.createPasswordResetToken();
        const resetURL = `${process.env.FE_URL}/auth/reset-password/?code=${resetToken}`;
        const subject = "WeChat - Here's your Password Reset Link";
        const message = (0, reset_1.default)(user.firstName, resetURL);
        await (0, Mailer_services_1.sendMail)(req.body.email, subject, message);
        return res.status(200).json({
            status: "success",
            message: "Reset Password link sent",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.ForgotPassword = ForgotPassword;
const VerifyOtp = async (req, res, next) => {
    try {
        const { otp, email } = req.body;
        const existOtp = await Otp_models_1.default.findOne({
            email,
        });
        if (!existOtp || !await existOtp.correctOTP(otp, existOtp.otp)) {
            throw http_errors_1.default.BadRequest("OTP Expired or Invalid ");
        }
        const user = await User_models_1.default.findOne({
            email
        });
        const access_token = await (0, AuthServ_services_1.generateLoginTokens)(user, res);
        return res.status(200).json({
            status: "success",
            message: "OTP verified",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                email: user.email,
                activityStatus: user.activityStatus,
                onlineStatus: user.onlineStatus,
                token: access_token,
            },
        });
    }
    catch (err) {
        next(err);
    }
    next();
};
exports.VerifyOtp = VerifyOtp;
const ResetPassword = async (req, res) => {
    try {
        if (!req.body.token) {
            throw http_errors_1.default.BadRequest("Required field: token");
        }
        console.log('ok', req.body.token);
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(req.body.token)
            .digest("hex");
        console.log('ok', hashedToken);
        const user = await User_models_1.default.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            throw http_errors_1.default.BadRequest("Token Expired or Invalid Token");
        }
        user.password = req.body.password;
        await user.save();
        console.log('ok');
        return res.status(200).json({
            status: "success",
            message: "Password Reset Successfully",
        });
    }
    catch (error) {
    }
};
exports.ResetPassword = ResetPassword;
const SendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw http_errors_1.default.BadRequest("Required field: email");
        }
        const user = await User_models_1.default.findOne({ email: email });
        if (!user) {
            throw http_errors_1.default.NotFound("Email is not registered");
        }
        const otp = (0, CreatOtp_utils_1.createOtp)(6);
        const data = {
            email: email,
            otp: otp,
            expireAt: Date.now() + 180000,
        };
        const newOTP = new Otp_models_1.default(data);
        await newOTP.save();
        const lastResetLinkTime = user.passwordResetLastSent ? new Date(user.passwordResetLastSent).getTime() : null;
        const cooldownPeriod = 90 * 1000;
        user.passwordResetLastSent = new Date(Date.now());
        await user.save();
        const subject = 'Mã OTP xác minh mật khẩu';
        const message = `
        Mã OTP của bạn là: <b>${otp}</b><br>
        Vui lòng không để lộ mã này.`;
        (0, Mailer_services_1.sendMail)(email, subject, message);
        return res.status(200).json({
            status: "success",
            message: "OTP Sent",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.SendOtp = SendOtp;
const Logout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken');
        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.Logout = Logout;
//# sourceMappingURL=auth.controller.js.map