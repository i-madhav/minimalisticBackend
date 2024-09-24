import { Router } from "express";
import routerUser from "./user.routes.js";
const routerIndex = Router();

routerIndex.use("/user" , routerUser);
export default routerIndex;