"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const friends_routes_1 = __importDefault(require("./friends.routes"));
const conversations_routes_1 = __importDefault(require("./conversations.routes"));
const message_routes_1 = __importDefault(require("./message.routes"));
const AuthMdlw = __importStar(require("../middleware/auth.mdlw"));
const apilink_1 = __importDefault(require("../config/apilink"));
exports.default = (app) => {
    app.use(`${apilink_1.default}/auth`, auth_routes_1.default);
    app.use(`${apilink_1.default}/user`, user_routes_1.default);
    app.use(`${apilink_1.default}/friends`, AuthMdlw.protect, friends_routes_1.default);
    app.use(`${apilink_1.default}/conversation`, AuthMdlw.protect, conversations_routes_1.default);
    app.use(`${apilink_1.default}/message`, AuthMdlw.protect, message_routes_1.default);
};
//# sourceMappingURL=index.routes.js.map