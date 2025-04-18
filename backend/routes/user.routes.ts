import express, { Router } from 'express';
const router: Router = express.Router();

import * as controller from '../controllers/user.controller'; // Use ES module import
router.get('/search', controller.FindUser);

export default router;
