import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import socketMldw from "./middleware/socket.mdlw";
import User from "./models/User.models";

import * as socketServ from './services/Socket.services'
import { NextFunction } from "express";
import mongoose from "mongoose";
export const initSocketServer = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FE_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true, // Optional: only if you're using credentials like cookies or authorization headers
        },
        pingInterval: 25000,
        pingTimeout: 20000,
    });
    // console.log(io)
    io.use(socketMldw)

    io.use((socket: Socket, next: NextFunction) => {
        (socket as any).errorHandler = (error: any) => {
            socket.emit("error", { status: "error", message: error });
        };

        next();
    });

    io.on('connection', async (socket) => {
        console.log("connect success from: ", socket.id);
        const user = (socket as any).user;

        socket.join(user._id.toString());

        await User.findByIdAndUpdate(user._id, { onlineStatus: "online" });

        socketServ.emitStatus(io, socket, user, "online");
        socketServ.joinConver(socket, user.id);


        socket.on("disconnect", async () => {
            console.log("disconnect success");

            await User.findByIdAndUpdate(user._id, { onlineStatus: "offline" });
            socketServ.emitStatus(io, socket, user, "offline");
        })

        socket.on('start_typing', async (conversation_id) => {
            try {
                socket.in(conversation_id).emit("start_typing", {
                    typing: true,
                    conversation_id: conversation_id,
                })
            } catch (err) {
                (socket as any).errorHandler("Error with typing");
            }
        })

        socket.on('stop_typing', async (conversation_id) => {
            try {
                socket.in(conversation_id).emit("stop_typing", {
                    typing: false,
                    conversation_id: conversation_id,
                })
            } catch (err) {
                (socket as any).errorHandler("Error with typing");
            }
        })

        socket.on('send_message', async (message) => {
            try {
                const conversation = message.conversation;
                if (!conversation.users) return;

                // Create a new message with a generated ID
                const msg_id = new mongoose.Types.ObjectId();
                message._id = msg_id;

                // Process and save the message
                const savedMessage = await socketServ.sendMess(socket, user._id, message);
                // console.log(io.sockets.adapter.rooms)
                if (savedMessage) {
                    // Emit to sender (optimistic approach)
                    socket.emit("message_received", savedMessage);
                    conversation.users.forEach((u: any) => {
                        if (savedMessage.sender && u._id &&
                            savedMessage.sender.toString() !== u._id.toString()) {
                            // Use io.to() instead of socket.in() to ensure delivery
                            const clients = io.sockets.adapter.rooms.get(u._id);
                            console.log(typeof u._id, clients)
                            socket.in(conversation._id).emit("message_received", savedMessage);
                        }
                    });
                }

            } catch (error) {
                console.error("Error sending message:", error);
                (socket as any).errorHandler("Error sending message");
            }
        })

    });

}
