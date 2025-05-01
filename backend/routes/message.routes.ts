import express, { Router } from 'express';
import trimRequest from "ts-trim-request"
const router: Router = express.Router();

import * as controller from '../controllers/messages.controller';
// router.post('/send-message', trimRequest.all, controller.SendMess)
// router.route('/send-message').post(trimRequest.all, controller.SendMess));

router.get('/get-messages/:cid', trimRequest.all, controller.GetMess);

export default router;