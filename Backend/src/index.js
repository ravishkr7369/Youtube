// import dotenv from 'dotenv';
// import connectDB from './db/index.js';
// import serverless from 'serverless-http';
//import app from './app.js';


// dotenv.config({ path: './.env' });

// let isDbReady = false;

// // Ensure DB connection
// async function ensureDb() {
// 	if (!isDbReady) {
// 		console.log("Connecting to database...");
// 		await connectDB();
// 		isDbReady = true;
// 	}
// }

// // Middleware to connect DB before handling any request
// app.use(async (req, res, next) => {
// 	await ensureDb();
// 	next();
// });




// const PORT = process.env.PORT || 8000;


// connectDB()
// .then(()=>{
// 	console.log(`Server is running on port ${PORT}`);
// })

// .catch((error)=>{
// 	console.error('Error connecting to database:', error.message);
// 	process.exit(1); // Exit the process with failure
// })






// export default serverless(app);

import express from "express";
import serverless from "serverless-http";

const app = express();

// ✅ test route
app.get("/", (req, res) => {
	res.send("🚀 Backend is working on Vercel!");
});

// ✅ ek aur route test ke liye
app.get("/api/hello", (req, res) => {
	res.json({ message: "Hello from Vercel backend!" });
});

export default serverless(app);

