const express = require("express");
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//routes imports
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const retweetsRoute = require("./routes/retweetsRoute");

//routes
app.use("/api/v1", userRoute);
app.use("/api/v1", postRoute);
app.use("/api/v1", commentRoute);
app.use("/api/v1", retweetsRoute);

//error middleware
app.use(errorMiddleware);

module.exports = app;
