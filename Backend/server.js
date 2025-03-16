const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database.js");
const cloudinary = require("cloudinary");

dotenv.config();
connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
    console.log(`running on port ${process.env.PORT} `);
});
