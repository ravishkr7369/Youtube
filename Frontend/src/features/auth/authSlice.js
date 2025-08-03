import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Set up axios defaults
axios.defaults.withCredentials = true;
const BASE_URL = `${import.meta.env.VITE_URL}`;

// ---------------------------
// Thunks (Async API calls)
// ---------------------------

// 1. Register
export const signup = createAsyncThunk("auth/register", async (formData, thunkAPI) => {
	try {
		const res = await axios.post(`${BASE_URL}/users/register`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res.data.data;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message);
	}
});

// 2. Login
export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
	try {
		const res = await axios.post(`${BASE_URL}/users/login`, data);
		return res.data.data;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message);
	}
});

// 3. Logout
export const logoutUser = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
	try {
		await axios.post(`${BASE_URL}/users/logout`);
		return null;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message);
	}
});

// 4. Refresh token
export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, thunkAPI) => {
	try {
		const res = await axios.post(`${BASE_URL}/users/refresh-token`);
		return res.data.data;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message);
	}
});

// 5. Change password
export const changePassword = createAsyncThunk("auth/changePassword", async (data, thunkAPI) => {
	try {
		const res = await axios.post(`${BASE_URL}/users/forget-password`, data);
		return res.data.message;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message);
	}
});

// 6. Get current user
export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, thunkAPI) => {
	try {
		const res = await axios.get(`${BASE_URL}/users/current-user`);
	
		return res.data.data;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message);
	}
});

// 7. Update user details
export const updateUserDetails = createAsyncThunk("auth/updateDetails", async (data, thunkAPI) => {
	try {
		const res = await axios.patch(`${BASE_URL}/users/update-account`, data);
		return res.data.data;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message);
	}
});

// 8. Update avatar
export const updateAvatar = createAsyncThunk("auth/updateAvatar", async (avatarFile, thunkAPI) => {
	try {
		const formData = new FormData();
		formData.append("avatar", avatarFile);
		const res = await axios.patch(`${BASE_URL}/users/avatar`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res.data.data;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message);
	}
});

// 9. Update cover image
export const updateCoverImage = createAsyncThunk("auth/updateCoverImage", async (coverImage, thunkAPI) => {
	try {
		const formData = new FormData();
		formData.append("coverImage", coverImage);
		const res = await axios.patch(`${BASE_URL}/users/cover-image`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res.data.data;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message);
	}
});

// 10. Get channel by username
export const getChannelProfile = createAsyncThunk("auth/getChannelProfile", async (username, thunkAPI) => {
	try {
		const res = await axios.get(`${BASE_URL}/users/c/${username}`);
		return res.data.data;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message);
	}
});

// 11. Get watch history
export const getWatchHistory = createAsyncThunk("auth/getWatchHistory", async (_, thunkAPI) => {
	try {
		const res = await axios.get(`${BASE_URL}/users/history`);
		return res.data.data;
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response?.data?.message);
	}
});




// ---------------------------
// Auth Slice
// ---------------------------

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		loading: false,
		error: null,
		message: null,
		isAuthenticated: false,
		 
	},
	reducers: {
		logout: (state) => {
			state.user = null;
			state.error = null;
			state.message = null;
			state.isAuthenticated = false;

		},
	},
	extraReducers: (builder) => {
		// First, add all your addCase calls
		builder
			.addCase(signup.fulfilled, (state) => {
				state.loading = false;
				state.error = null;
				state.message = "Signup successful"; 
				
			})

			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
				state.error = null;
				state.isAuthenticated = true;
			})
			.addCase(fetchCurrentUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
				state.error = null;
				state.isAuthenticated = true;
			})
			.addCase(fetchCurrentUser.rejected, (state, action) => {
				state.loading = false;
				state.user = null;
				state.isAuthenticated = false;
				state.error = action.payload;
			  })
			.addCase(updateUserDetails.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
				state.error = null;
			})
			.addCase(updateAvatar.fulfilled, (state, action) => {
				state.loading = false;
				state.user.avatar = action.payload.avatar;
				state.error = null;
			})
			.addCase(updateCoverImage.fulfilled, (state, action) => {
				state.loading = false;
				state.user.coverImage = action.payload.coverImage;
				state.error = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.loading = false;
			})
			.addCase(changePassword.fulfilled, (state, action) => {
				state.loading = false;
				state.message = action.payload;
			});

		// Next, add all matchers and default case
		builder
			.addMatcher(
				(action) => action.type.startsWith("auth/") && action.type.endsWith("/pending"),
				(state) => {
					state.loading = true;
					state.error = null;
					state.message = null;
				}
			)
			.addMatcher(
				(action) => action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
				(state, action) => {
					state.loading = false;
					state.error = action.payload;
				}
			);
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
