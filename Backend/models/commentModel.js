const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    comment: {
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
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments",
        },
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    mentions: [
        {
            type: String,
        },
    ],
});

module.exports = mongoose.model("Comments", commentSchema);
