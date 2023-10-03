const express = require("express");
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");

const app = express();

app.use(compression({ level: 6 }));

app.use(cors({ credentials: true, origin: "https://twitter-clone-by-manishthef.vercel.app/" }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//routes imports
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const retweetsRoute = require("./routes/retweetsRoute");
const messageRoute = require("./routes/chat/messageRoute");
const conversationRoute = require("./routes/chat/conversationRoute");

//routes
app.use("/api/v1", userRoute);
app.use("/api/v1", postRoute);
app.use("/api/v1", commentRoute);
app.use("/api/v1", retweetsRoute);
app.use("/api/v1/chat", messageRoute);
app.use("/api/v1/chat/conversation", conversationRoute);

//error middleware
app.use(errorMiddleware);

module.exports = app;
