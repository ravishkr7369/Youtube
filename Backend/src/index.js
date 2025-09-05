import dotenv from 'dotenv';
import connectDB from './db/index.js';
import serverless from 'serverless-http';
import app from './app.js';

dotenv.config({ path: './.env' });

let isDbReady = false;
async function ensureDb() {
	if (!isDbReady) {
		console.log("Connecting to database...");
		await connectDB();
		isDbReady = true;
	}
}

// Middleware to ensure DB is ready before handling any request
app.use(async (req, res, next) => {
	await ensureDb();
	next();
});

// Export serverless handler


const PORT = process.env.PORT || 8000;


// connectDB()
// .then(()=>{
// 	app.listen(PORT, () => {
// 		console.log(`Server is running on port ${PORT}`);
// 	})
// })

// .catch((error)=>{
// 	console.error('Error connecting to database:', error.message);
// 	process.exit(1); // Exit the process with failure
// })



export default serverless(app);

