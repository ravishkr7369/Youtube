import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";




export const jwtVerify = asyncHandler(async (req, res, next) => {

	const token = req.cookies?.accessToken||req.headers?.authorization || null;
	//console.log("token", token)
	if (!token) {

		throw new ApiError(401, "Access token is missing or invalid");

	}
	try {

		// Verify the token using the secret key

	
		const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


		const user = await User.findById(decodedToken?._id).select("-password -refreshToken -__v -createdAt -updatedAt");

		if (!user) {
			throw new ApiError(404, "Invalid access token")
		}

		req.user = user;



		next();
	}
	catch (error) {

		throw new ApiError(401, "Unauthorized access")
	}
})