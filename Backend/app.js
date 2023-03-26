const express = require("express");
const { urlencoded } = require("express");
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

//routes imports
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
//routes
app.use("/api/v1", userRoute);
app.use("/api/v1", postRoute);

//error middleware
app.use(errorMiddleware);

module.exports = app;
