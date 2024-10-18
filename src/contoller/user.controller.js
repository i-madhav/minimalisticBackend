import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.modal.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { z } from "zod";

const signupzod = z.object({
    fullName: z.string().min(3).max(30).trim().toLowerCase(),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "password must be atleast 8 character long")
})

const signinzod = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "password must be atleast 8 character long")
})

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "couldn't generate refresh token and access token")
    }
}

const signupUser = asyncHandler(async (req, res) => {
    const result = signupzod.safeParse(req.body);
    if (!result.success) {
        const error = result.error.errors.map(err => err.message).join(", ");
        throw new ApiError(400, `Validation Failed - ${error}`)
    }

    const { fullName, email, password } = result.data;

    const existedUser = await User.findOne({
        $or: [{ email }]
    })

    if (existedUser) throw new ApiError(500, "User already exist");

    const user = await User.create({
        fullName: fullName,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) throw new ApiError(400, "Unable to create user")

    return res.status(200).json(new ApiResponse(200, "user created successfully", createdUser))
});

const signinUser = asyncHandler(async (req, res) => {
    const result = signinzod.safeParse(req.body);
    if (!result.success) {
        const error = result.error.errors.map(err => err.message).join(", ");
        throw new ApiError(500, `Invalid credentials ${error}`)
    }
    const { email, password } = result.data;

    const user = await User.findOne({
        $or: [{ email }, { password }]
    });

    if (!user) throw new ApiError(400, "email or password is invalid");

    const isPassowordValid = await user.isPassowordValid(password);

    if (!isPassowordValid) throw new ApiError(400, "password is invalid");

    const { accessToken, refreshToken } = await generateToken(user._id);    

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,    
        secure: true,                    
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, "user sign in successfully", loggedInUser))
});


const signoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    },
        {
            new: true
        })

    const options = {
        httpOnly: true,    
        secure: true,                   
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "user signedout successfully"))
});

const userInformation = asyncHandler(async(req , res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken")
    if(!user) throw new ApiError(404,"user is not logged-in/unauthenticated-user");

    return res.status(200).json(new ApiResponse(200,"user  information fetched successfully",user))
});

export { signupUser, signinUser , signoutUser , userInformation}