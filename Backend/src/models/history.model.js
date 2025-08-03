import mongoose, { Schema } from "mongoose";

const historySchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		video: {
			type: Schema.Types.ObjectId,
			ref: "Video",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

historySchema.index({ user: 1, video: 1 }, { unique: true }); // prevent duplicate entries

export const History = mongoose.model("History", historySchema);
