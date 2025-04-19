import express, { Router } from 'express';
const router: Router = express.Router();

import * as controller from '../controllers/auth.controller'; // Use ES module import
router.post('/login', controller.Login);

router.post('/register', controller.Register);

router.post('/send-otp', controller.SendOtp);

router.post('/forgot-password', controller.ForgotPassword);

// // router.get('/password/otp', controller.OtpPostpPost);
router.post('/verify-otp', controller.VerifyOtp);

// // router.get('/password/reset', controller.ResetPassword);
router.post('/reset-password', controller.ResetPassword);
router.post('/logout', controller.Logout);

export default router;
