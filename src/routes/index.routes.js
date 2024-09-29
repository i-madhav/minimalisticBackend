import { Router } from "express";
import routerUser from "./user.routes.js";
import routerDocument from "./document.routes.js";
const routerIndex = Router();

routerIndex.use("/user" , routerUser);
routerIndex.use("/document",routerDocument);

export default routerIndex;