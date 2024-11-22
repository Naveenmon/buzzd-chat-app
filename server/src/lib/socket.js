import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin:[`${process.env.VITE_FRONTEND_URL}`],
    },
})
console.log(`"${process.env.VITE_FRONTEND_URL}"`)


export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("a user  connected", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("a user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

export {io, app, server};