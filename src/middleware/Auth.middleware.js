import { User } from "../models/user.modal.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const AuthenticateUser = asyncHandler(async(req , res , next) => {
    const token = req.cookies?.accessToken;
    if(!token) throw new ApiError(403 , "user not found");

    const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if(!user) throw new ApiError(403 , "unauthorized user");

    req.user = user;
    next();
})