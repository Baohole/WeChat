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
exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
const socket_mdlw_1 = __importDefault(require("./middleware/socket.mdlw"));
const User_models_1 = __importDefault(require("./models/User.models"));
const socketServ = __importStar(require("./services/Socket.services"));
const mongoose_1 = __importDefault(require("mongoose"));
const initSocketServer = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FE_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
        pingInterval: 25000,
        pingTimeout: 20000,
    });
    io.use(socket_mdlw_1.default);
    io.use((socket, next) => {
        socket.errorHandler = (error) => {
            socket.emit("error", { status: "error", message: error });
        };
        next();
    });
    io.on('connection', async (socket) => {
        console.log("connect success from: ", socket.id);
        const user = socket.user;
        socket.join(user._id.toString());
        await User_models_1.default.findByIdAndUpdate(user._id, { onlineStatus: "online" });
        socketServ.emitStatus(io, socket, user, "online");
        socketServ.joinConver(socket, user.id);
        socket.on("disconnect", async () => {
            console.log("disconnect success");
            await User_models_1.default.findByIdAndUpdate(user._id, { onlineStatus: "offline" });
            socketServ.emitStatus(io, socket, user, "offline");
        });
        socket.on('start_typing', async (conversation_id) => {
            try {
                socket.in(conversation_id).emit("start_typing", {
                    typing: true,
                    conversation_id: conversation_id,
                });
            }
            catch (err) {
                socket.errorHandler("Error with typing");
            }
        });
        socket.on('stop_typing', async (conversation_id) => {
            try {
                socket.in(conversation_id).emit("stop_typing", {
                    typing: false,
                    conversation_id: conversation_id,
                });
            }
            catch (err) {
                socket.errorHandler("Error with typing");
            }
        });
        socket.on('send_message', async (message) => {
            try {
                const conversation = message.conversation;
                if (!conversation.users)
                    return;
                const msg_id = new mongoose_1.default.Types.ObjectId();
                message._id = msg_id;
                const savedMessage = await socketServ.sendMess(socket, user._id, message);
                if (savedMessage) {
                    socket.emit("message_received", savedMessage);
                    conversation.users.forEach((u) => {
                        if (savedMessage.sender && u._id &&
                            savedMessage.sender.toString() !== u._id.toString()) {
                            socket.in(u._id).emit("message_received", savedMessage);
                        }
                    });
                }
            }
            catch (error) {
                console.error("Error sending message:", error);
                socket.errorHandler("Error sending message");
            }
        });
    });
};
exports.initSocketServer = initSocketServer;
//# sourceMappingURL=socket.js.map