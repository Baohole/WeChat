import express, { Router } from 'express';
import trimRequest from "ts-trim-request"
const router : Router = express.Router();

import * as controller from '../controllers/messages.controller'; 
router.post('/send-message', trimRequest.all, controller.SendMess)
// router.route('/send-message').post(trimRequest.all, controller.SendMess));

// router.route('/get-messages/:cid').get(trimRequest.all, controller.GetMess);

// router.post('/send-otp', controller.SendOtp);

// router.post('/forgot-password', controller.ForgotPassword);

// // // router.get('/password/otp', controller.OtpPostpPost);
// router.post('/verify-otp', controller.VerifyOtp);

// // // router.get('/password/reset', controller.ResetPassword);
// router.post('/reset-password', controller.ResetPassword);

export default router;
