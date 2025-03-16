const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    deletedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],

    latest: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
            },
            message: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
            },
        },
    ],
});

module.exports = mongoose.model("Conversation", conversationSchema);
