const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");
const Users = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

//adding comment on a post
exports.postComment = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id).populate("comments");
        if (!post) {
            return next(new ErrorHandler("post not found", 400));
        }
        const newData = {
            comment: req.body.comment,
            images: req.body.images,
            video: req.body.video,
            owner: req.user._id,
            post: req.params.id,
        };

        let commentIndex = -1;
        post.comments.forEach((item, index) => {
            if (item.owner.toString() === req.user._id.toString()) {
                if (req.body.comment === item.comment) {
                    commentIndex = index;
                }
            }
        });
        if (commentIndex !== -1) {
            return res.status(400).json({
                success: false,
                message: "Oops already wrote this message",
            });
        }

        const newCreateComment = await Comments.create(newData);

        post.comments.unshift(newCreateComment._id);
        await post.save();

        return res.status(200).json({
            success: true,
            message: "comment added",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id).populate("comments");
        if (!post) {
            return next(new ErrorHandler("post not found", 400));
        }

        //owner of post can delete any comment

        const commentID = req.body.commentID;
        if (commentID === undefined) {
            return next(new ErrorHandler("commment id required", 400));
        }

        post.comments.forEach((item, index) => {
            if (item._id.toString() === req.body.commentID.toString()) {
                return post.comments.splice(index, 1);
            } else {
                return next(new ErrorHandler("commment  not found", 400));
            }
        });

        await post.save();
        await Comments.deleteOne({ _id: commentID });

        return res.status(200).json({
            success: true,
            message: "comment deleted",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
