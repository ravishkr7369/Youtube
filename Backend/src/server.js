import dotenv from 'dotenv';
import connectDB from './db/index.js';
import app from './app.js';


const PORT = process.env.PORT ;


connectDB()

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});






