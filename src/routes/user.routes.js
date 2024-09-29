import { Router } from "express";
import { signinUser, signoutUser, signupUser, userInformation } from "../contoller/user.controller.js";
import { AuthenticateUser } from "../middleware/Auth.middleware.js";

const routerUser = Router();
routerUser.route("/signup").post(signupUser);
routerUser.route("/signin").post(signinUser);
routerUser.route("/signout").post(AuthenticateUser , signoutUser);
routerUser.route("/user/me").get(AuthenticateUser , userInformation)

export default routerUser;