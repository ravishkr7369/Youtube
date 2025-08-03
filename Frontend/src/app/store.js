// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import videoReducer from "../features/auth/videoSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		video:videoReducer,
	},
});

export default store;
