import { Router } from "express";
import { signinUser, signupUser } from "../contoller/user.controller.js";

const routerUser = Router();
routerUser.route("/signup").post(signupUser);
routerUser.route("/signin").post(signinUser);

export default routerUser;