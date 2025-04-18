import { Server } from "socket.io";
import { Server as HttpServer } from "http";

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

    io.on('connection', async (socket) => {
        console.log("connect success from: ", socket.id)
    })
}
