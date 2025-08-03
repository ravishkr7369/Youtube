import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { History } from '../models/history.model.js'
import mongoose, { isValidObjectId } from "mongoose"

export const addToHistory = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const { videoId } = req.body;


	if (!mongoose.Types.ObjectId.isValid(userId)) {
		throw new ApiError(400, "Invalid user ID");
	}

	if (!mongoose.Types.ObjectId.isValid(videoId)) {
			throw new ApiError(400, "Invalid video ID");
		}

	// Upsert: if entry exists, update timestamp; else insert
	await History.findOneAndUpdate(
		{ user: userId, video: videoId },
		{ user: userId, video: videoId },
		{ upsert: true, new: true, setDefaultsOnInsert: true }
	);


	return res.status(200).json(
		new ApiResponse(200, {
			success: true,
			message: "Video added to history",
		})
	)
})


export const getUserHistory = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	if (!mongoose.Types.ObjectId.isValid(userId)) {
		throw new ApiError(400, "Invalid user ID");
	}
	const history = await History.find({ user: userId })
		.populate({
			path: "video",
			select: "title thumbnail views createdAt",
			populate: {
				path: "owner",
				select: "username avatar",
			},
		})
		.sort({ updatedAt: -1 });


	const videos = history
		.map((entry) => entry.video)
		.filter((v) => v !== null); // in case some videos 
		
		return res.status(200).json(
			new ApiResponse(200,{
				success: true,
				message: "History fetched",
				data: videos,
			})
		)

	
});


