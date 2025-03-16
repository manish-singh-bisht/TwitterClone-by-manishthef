const mongoose = require("mongoose");

const retweetsSchema = new mongoose.Schema({
    userRetweeted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    originalPost: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "onModel",
    },
    onModel: {
        type: String,
        enum: ["Posts", "Comments"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Retweets", retweetsSchema);
