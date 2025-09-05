import dotenv from 'dotenv';
import connectDB from './db/index.js';
import serverless from 'serverless-http';
import app from './app.js';


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

const app = express();

app.get("/", (req, res) => {
	res.send("Hello Vercel 🚀");
});

export default app;

