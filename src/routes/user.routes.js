import { Router } from "express";
import { signinUser, signoutUser, signupUser } from "../contoller/user.controller.js";
import { AuthenticateUser } from "../middleware/Auth.middleware.js";

const routerUser = Router();
routerUser.route("/signup").post(signupUser);
routerUser.route("/signin").post(signinUser);
routerUser.route("/signout").post(AuthenticateUser , signoutUser)

export default routerUser;