import express, { Router } from 'express';
import trimRequest from "ts-trim-request"
const router: Router = express.Router();

import * as controller from '../controllers/friends.controller';

router.post('/send-request', trimRequest.all, controller.SendReq);
router.post('/accept-reject-request', trimRequest.all, controller.AccRejcetReq);
router.post('/remove-friend', trimRequest.all, controller.RemoveFriend);
router.post('/cancel-request', trimRequest.all, controller.CancelReq);

router.get('/get-requests', trimRequest.all, controller.GetReq);
router.get('/get-friends', trimRequest.all, controller.GetFriends);
router.get('/get-sent-requests', trimRequest.all, controller.GetSentReq);
router.get('/online-friends', trimRequest.all, controller.OnlFriends);
router.get('/search', trimRequest.all, controller.SearchFriends);

export default router;