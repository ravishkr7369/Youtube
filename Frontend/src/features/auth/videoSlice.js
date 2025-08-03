import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_URL}`;

const initialState = {
	isLoading: true,
	videos: [],
	searchResults: [],
	error: null,
};

// Home Page: fetch all videos
export const getVideos = createAsyncThunk("videos/get", async (_, thunkAPI) => {
	try {
		const response = await axios.get(`${BASE_URL}/videos`, {
			withCredentials: true,
		});

		// console.log("videos", response?.data?.data?.videos);
		return response?.data?.data?.videos;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message);
	}
});

// Search Page: fetch videos based on query
export const searchVideos = createAsyncThunk("videos/search", async (query, thunkAPI) => {
	try {
		const response = await axios.get(`${BASE_URL}/videos?query=${encodeURIComponent(query)}`, {
			withCredentials: true,
		});

		//console.log("search results", response?.data?.data?.videos);
		return response?.data?.data.videos;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message);
	}
});

const videoSlice = createSlice({
	name: "videos",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Home videos
			.addCase(getVideos.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getVideos.fulfilled, (state, action) => {
				state.isLoading = false;
				state.videos = action.payload;
			})
			.addCase(getVideos.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Search results
			.addCase(searchVideos.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(searchVideos.fulfilled, (state, action) => {
				state.isLoading = false;
				state.searchResults = action.payload;
				//console.log("search results in slice", action.payload);
			})
			.addCase(searchVideos.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export default videoSlice.reducer;
