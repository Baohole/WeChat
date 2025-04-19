import express, { Router } from 'express';
const router: Router = express.Router();

import * as controller from '../controllers/user.controller';

router.get('/search', controller.FindUser);
router.get('/getUserData', controller.GetUserData);

export default router;
