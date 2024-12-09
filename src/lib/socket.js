import { Server } from 'socket.io';
import hhtp from 'http';
import express from 'express';

const app = express();
const server = hhtp.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://oplo.amirhurtado.com",
    credentials: true,
       
    }
})

const userSocketMap = {}

export const getReceivedId = (userId) => {
    return userSocketMap[userId]
}


io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId

    if(userId) userSocketMap[userId] = socket.id

    io.emit("onlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("Usuario desconectado", socket.id)
        delete userSocketMap[userId]
        io.emit("onlineUsers", Object.keys(userSocketMap))
    })
})

export { io, app, server };