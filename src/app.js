import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();

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
 app.use("/api/v1" , routerIndex);


export {app};