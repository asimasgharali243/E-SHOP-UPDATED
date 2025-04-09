import { app } from './app.js';
import dotenv from 'dotenv';
import connectDB from './Config/ConnectDB.js';
import cloudinary from "cloudinary";

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });

dotenv.config();

connectDB();
cloudinary.config({
    cloud_name: "dfzhwu2c5",
    api_key: "399145913243965",
    api_secret: "5UuKnTWZfxe75Uzc7rCGiorYlEM",
  });

      


const server=app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
 

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });
  