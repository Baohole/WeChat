import { Request, Response, NextFunction } from 'express';
import createHttpError from "http-errors";
import crypto from "crypto";
import { Model } from 'mongoose';

import { generateLoginTokens } from '../services/AuthServ.services';
import { sendMail, formatRemainingTime } from '../services/Mailer.services';
import { filterObj } from '../utils/FilterObjs.utils';
import { createOtp } from '../utils/CreatOtp.utils';
import reset from '../mailtemplates/reset';

import User, { IUser } from '../models/User.models';
import Otp from '../models/Otp.models';

// const createOTP = require('../../helper/creatOTP.helper');
// const sendMail = require('../../helper/sendMail.helper');


//[POST] /auth/login
export const Login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email, password }: { email: string; password: string } = req.body;
        // check for empty fields
        if (!email || !password) {
            throw createHttpError.BadRequest("Required fields: email & password");
        }

        const user = await User.findOne({ email: email }).select('password');
        // console.log(user)
        // if (!user || !(await user.correctPassword(password, user.password))) {
        //     throw createHttpError.BadRequest("Incorrect Email or Password")
        // }

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
                token: await generateLoginTokens(user, res),
            },
        })


    } catch (error) {
        next(error)
    }

}

//[POST] /auth/register
export const Register = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { firstName, lastName, email, password }:
            { firstName: string, lastName: string, email: string, password: string } = req.body;

        // check for empty fields
        if (!firstName || !lastName || !email || !password) {
            throw createHttpError.BadRequest(
                "Required fields: firstName, lastName, email & password"
            );
        }
        const filteredBody = filterObj(
            req.body,
            "firstName",
            "lastName",
            "email",
            "password"
        );
        const user = new User(filteredBody);
        await user.save();
        req.userId = user.id;
        res.status(200).json({
            status: "success",

        })
    } catch (error) {
        next(error);
    }
    next();
}

//[POST] /auth/forgot-password
export const ForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email }: { email: string } = req.body;

        // Check for empty fields
        if (!email) {
            throw createHttpError.BadRequest("Required field: email");
        }

        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            throw createHttpError.NotFound("Email is not registered");
        }

        // Check for password reset cooldown
        const lastResetLinkTime: number = user.passwordResetLastSent ? new Date(user.passwordResetLastSent).getTime() : null;
        const cooldownPeriod = 90 * 1000; // 90 seconds

        if (
            lastResetLinkTime &&
            Date.now() - lastResetLinkTime < cooldownPeriod
        ) {
            const timeRemaining = Math.ceil(
                (cooldownPeriod - (Date.now() - lastResetLinkTime)) / 1000
            );
            const remainingTimeString = formatRemainingTime(timeRemaining);

            throw createHttpError.TooEarly(
                `Please wait ${remainingTimeString} before requesting a new reset link`
            );
        }


        // Update last sent time for password reset link
        user.passwordResetLastSent = new Date(Date.now());
        await user.save();  // Save updated user document

        const resetToken = await user.createPasswordResetToken();
        const resetURL = `${process.env.FE_URL}/auth/reset-password/?code=${resetToken}`;

        const subject = "WeChat - Here's your Password Reset Link";
        const message = reset(user.firstName, resetURL);

        // Send the OTP email to the user
        await sendMail(req.body.email, subject, message);
        return res.status(200).json({
            status: "success",
            message: "Reset Password link sent",
        });
    } catch (error) {
        next(error);  // Pass the error to the error-handling middleware
    }
}

//[POST] /auth/verify-otp
export const VerifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { otp, email }: { otp: string, email: string } = req.body
        const existOtp = await Otp.findOne({
            email,
        });
        if (!existOtp || !await existOtp.correctOTP(otp, existOtp.otp)) {
            throw createHttpError.BadRequest("OTP Expired or Invalid ");
        }
        const user = await User.findOne({
            email
        })

        // const resetToken = await user.createPasswordResetToken();
        // const resetURL = `${process.env.FE_URL}/auth/reset-password/?code=${resetToken}`;

        // const subject = "WeChat - Here's your Password Reset Link";
        // const message = reset(user.firstName, resetURL);

        // // Send the OTP email to the user
        // sendMail(req.body.email, subject, message);
        const access_token = await generateLoginTokens(user, res);

        // grant access to login
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
    } catch (err) {
        next(err)
    }
    next()
}

//[POST] /reset-password
export const ResetPassword = async (req: Request, res: Response): Promise<any> => {
    //console.log(req.cookies.u)
    try {
        // check for empty fields
        if (!req.body.token) {
            throw createHttpError.BadRequest("Required field: token");
        }

        console.log('ok', req.body.token)

        const hashedToken = crypto
            .createHash("sha256")
            .update(req.body.token)
            .digest("hex");

        console.log('ok', hashedToken)
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        console.log('ok', user)

        if (!user) {
            throw createHttpError.BadRequest("Token Expired or Invalid Token");
        }
        user.password = req.body.password;
        await user.save()
        console.log('ok')

        return res.status(200).json({
            status: "success",
            message: "Password Reset Successfully",
        });
    } catch (error) {

    }
}

//[POST] /auth/verify
export const SendOtp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email }: { email: string } = req.body;

        // Check for empty fields
        if (!email) {
            throw createHttpError.BadRequest("Required field: email");
        }

        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            throw createHttpError.NotFound("Email is not registered");
        }

        // Create OTP
        const otp: string = createOtp(6);

        // Prepare data for OTP
        const data = {
            email: email,
            otp: otp,
            expireAt: Date.now() + 180000,  // Set expiration time for OTP (3 minutes)
        };

        // Create new OTP document and save to the database
        const newOTP = new Otp(data);
        await newOTP.save();

        // Check for password reset cooldown
        const lastResetLinkTime: number = user.passwordResetLastSent ? new Date(user.passwordResetLastSent).getTime() : null;
        const cooldownPeriod = 90 * 1000; // 90 seconds

        // if (
        //     lastResetLinkTime &&
        //     Date.now() - lastResetLinkTime < cooldownPeriod
        // ) {
        //     const timeRemaining = Math.ceil(
        //         (cooldownPeriod - (Date.now() - lastResetLinkTime)) / 1000
        //     );
        //     const remainingTimeString = formatRemainingTime(timeRemaining);

        //     throw createHttpError.TooEarly(
        //         `Please wait ${remainingTimeString} before requesting a new reset link`
        //     );
        // }


        // Update last sent time for password reset link
        user.passwordResetLastSent = new Date(Date.now());
        await user.save();  // Save updated user document

        // Prepare the email subject and message
        const subject = 'Mã OTP xác minh mật khẩu';
        const message = `
        Mã OTP của bạn là: <b>${otp}</b><br>
        Vui lòng không để lộ mã này.`;

        // Send the OTP email to the user
        sendMail(email, subject, message);

        // Return success response
        return res.status(200).json({
            status: "success",
            message: "OTP Sent",
        });
    } catch (error) {
        next(error);  // Pass the error to the error-handling middleware
    }
}

//[POST] /auth/logout
export const Logout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        res.clearCookie('accessToken')
        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });
    }
    catch (err) {
        next(err)
    }
}
