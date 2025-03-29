const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    tweet: {
        type: String,
    },
    images: [
        {
            public_id: String,
            url: String,
        },
    ],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    parent: {
        type: String,
    },
    whoCanReply: [{ type: String }],
    whoCanReplyNumber: { type: Number },

    threadIdForTweetInThread: { type: String },

    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments",
        },
    ],
    retweets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    mentions: [
        {
            type: String,
        },
    ],
});

module.exports = mongoose.model("Posts", postSchema);
