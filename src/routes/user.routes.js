import { Router } from "express";
import { serverActive, signinUser, signoutUser, signupUser, userInformation } from "../contoller/user.controller.js";
import { AuthenticateUser } from "../middleware/Auth.middleware.js";

const routerUser = Router();
routerUser.route("/signup").post(signupUser);
routerUser.route("/signin").post(signinUser);
routerUser.route("/serveractive").get(serverActive);
routerUser.route("/signout").post(AuthenticateUser , signoutUser);
routerUser.route("/me").get(AuthenticateUser , userInformation)

export default routerUser;