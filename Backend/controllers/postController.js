const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");
const Users = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createPost = async (req, res, next) => {
    try {
        const newData = {
            tweet: req.body.tweet,
            images: req.body.images,
            video: req.body.video,
            owner: req.user._id,
        };

        const createNewPost = await Posts.create(newData);

        //Finding user and pushing the post id into the user's post array.
        const user = await Users.findById(req.user._id);
        user.posts.unshift(createNewPost._id);
        await user.save();

        res.status(201).json({
            success: true,
            createNewPost,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.findPostById = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id)
            .populate("likes comments owner")
            .populate({
                path: "comments",
                populate: [{ path: "owner", select: "name handle profile" }, { path: "post" }, { path: "likes" }],
            });
        if (!post) {
            return next(new ErrorHandler("Post not found", 404));
        }
        return res.status(200).json({
            message: "success",
            post,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.likeAndUnlikePost = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) {
            return next(new ErrorHandler("Post is not present", 400));
        }

        //unlike post
        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);
            await post.save();

            return res.status(200).json({
                success: true,
                message: "post unliked successfully",
            });
        } else {
            //post like

            post.likes.push(req.user._id);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "post liked successfully",
            });
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) {
            return next(new ErrorHandler("Post not found", 400));
        }

        if (req.user._id.toString() === post.owner.toString()) {
            await post.deleteOne(post);

            //remove post from user
            const user = await Users.findById(req.user._id);
            const index = user.posts.indexOf(req.params.id);
            user.posts.splice(index, 1);
            await user.save();

            //deleting all comments in the post
            await Comments.deleteMany({ post: req.params.id });

            return res.status(200).json({
                success: true,
                message: "post deleted",
            });
        } else {
            return next(new ErrorHandler("Unauthorized", 401));
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.getPostofFollowing = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user._id);

        //Line below will bring all posts of the users that are being followed by the logged in user.
        const posts = await Posts.find({ owner: { $in: user.following } }).populate("owner likes comments");
        res.status(200).json({
            success: true,
            posts: posts.reverse(),
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
