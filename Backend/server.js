const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database.js");
dotenv.config();
connectDB();

app.listen(process.env.PORT, () => {
    console.log(`running on port ${process.env.PORT} `);
});
