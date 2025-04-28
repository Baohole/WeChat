import express, { Router } from "express";
import trimRequest from "ts-trim-request"
const router: Router = express.Router();

import * as controller from '../controllers/conversations.controller';

// Create New Conversation Route
router
    .route("/create-open-conversation")
    .post(trimRequest.all, controller.createOpenConversation);

router
    .route("/get-conversations")
    .get(trimRequest.all, controller.getConversations);

export default router;