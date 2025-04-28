import { Express } from "express";

import AuthRoutes from "./auth.routes";
import UserRoutes from "./user.routes";
import FriendRoutes from './friends.routes';
import ConvoRoutes from './conversations.routes'

import * as AuthMdlw from '../middleware/auth.mdlw'

import sysApi from "../config/apilink";

export default (app: Express) => {
    app.use(`${sysApi}/auth`, AuthRoutes);
    app.use(`${sysApi}/user`, UserRoutes);
    app.use(`${sysApi}/friends`, AuthMdlw.protect, FriendRoutes);
    app.use(`${sysApi}/conversation`, AuthMdlw.protect, ConvoRoutes)
}
