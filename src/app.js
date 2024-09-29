import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server , {
    cors:{
        origin:process.env.CORS_ORIGIN
    }
});

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true 
}))

//configuration
app.use(express.json({limit:"200kb"}))
app.use(express.urlencoded({extended:true , limit:"15kb"}))
app.use(express.static("public"))
app.use(cookieParser())


 import routerIndex from "./routes/index.routes.js";
import { handleSocketDocument } from "./Socket/Socket.js";
 app.use("/api/v1" , routerIndex);


handleSocketDocument(io);

export {server as app , io};