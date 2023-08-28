const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter your name"],
    },
    handle: {
        type: String,
        required: [true, "Enter the twitter handle you want for yourself"],
        unique: [true, "Try something else,it's already taken"],
    },
    email: {
        type: String,
        required: [true, "Enter your email"],
        unique: [true, "Email already exists"],
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Enter your email"],
        minlength: [8, "Password must be greater than 8"],
        select: false,
    },
    profile: {
        image: {
            public_id: String,
            url: String,
        },
        banner: {
            public_id: String,
            url: String,
        },
    },
    description: {
        type: String,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts",
        },
    ],
    pinnedTweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
    },
    pinnedConversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments",
        },
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: String,
        default: null,
    },
    website: {
        type: String,
        default: null,
    },
});

//hashing before saving the password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

//method for matching passwords during login
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//JWT Generation
userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("Users", userSchema);
