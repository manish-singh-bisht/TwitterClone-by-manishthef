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
        const posts = await Posts.find({ owner: { $in: user.following } }).populate("owner likes comments.user");
        res.status(200).json({
            success: true,
            posts: posts.reverse(),
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

//adding or updating comment on a post
exports.postComment = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) {
            return next(new ErrorHandler("post not found", 400));
        }

        //checking if user already has a comment ont the post
        const flag = -1;
        post.comments.forEach((item, index) => {
            if (item.user.toString() === req.user._id.toString()) {
                flag = index;
            }
        });
        if (flag !== -1) {
            //updating comment
            post.comments[flag].comment = req.body.comment;
            await post.save();
            return res.status(200).json({
                success: true,
                message: "comment updated",
            });
        } else {
            //commenting for the first time
            post.comments.push({
                user: req.user._id,
                comment: req.body.comment,
            });
            await post.save();

            return res.status(200).json({
                success: true,
                message: "comment added",
            });
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) {
            return next(new ErrorHandler("post not found", 400));
        }

        //owner of post can delete any comment
        if (post.owner.toString() === req.user._id.toString()) {
            const commentID = req.body.commentID;
            if (commentID === undefined) {
                return next(new ErrorHandler("commment id required", 400));
            }
            post.comments.forEach((item, index) => {
                if (item._id.toString() === req.body.commentID.toString()) {
                    return post.comments.splice(index, 1);
                }
            });

            await post.save();
            return res.status(200).json({
                success: true,
                message: "comment deleted",
            });
        } else {
            //owner of comment can only delete his/her comment
            post.comments.forEach((item, index) => {
                if (item.user.toString() === req.user._id.toString()) {
                    return post.comments.splice(index, 1);
                }
            });
            await post.save();
            return res.status(200).json({
                success: true,
                message: "your comment is deleted",
            });
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
