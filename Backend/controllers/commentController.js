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
            parent: req.body.parent,
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
        if (newData.parent) {
            const parentComment = await Comments.findById(newData.parent).populate("children");

            if (!parentComment) {
                return next(new ErrorHandler("parent comment not found", 400));
            }

            let commentParentIndex = -1;
            parentComment.children.forEach((item, index) => {
                if (item.owner.toString() === req.user._id.toString()) {
                    if (req.body.comment === item.comment) {
                        commentParentIndex = index;
                    }
                }
            });
            if (commentParentIndex !== -1) {
                return res.status(400).json({
                    success: false,
                    message: "Oops already wrote this message",
                });
            }

            const newCreateComment = await Comments.create(newData);

            parentComment.children.unshift(newCreateComment._id);

            await parentComment.save();
            return res.status(200).json({
                success: true,
                message: "child comment added",
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
        const post = await Posts.findById(req.params.post).populate("comments");
        const comment = await Comments.findById(req.params.comment);

        if (!post) {
            return next(new ErrorHandler("post not found", 400));
        }

        if (!comment) {
            return next(new ErrorHandler("commment  not found", 400));
        }

        //if comment is a child of a parent, then removing the child from parent's children array.
        if (comment.parent) {
            const parent = await Comments.findById(comment.parent).populate("children");
            parent.children.forEach((item, index) => {
                if (item._id.toString() === comment._id.toString()) {
                    parent.children.splice(index, 1);
                }
            });
            await parent.save();
        } else {
            //deleting comment from post,if no parent
            post.comments.forEach((item, index) => {
                if (item._id.toString() === req.params.comment.toString()) {
                    return post.comments.splice(index, 1);
                }
            });

            await post.save();
        }

        //deleting all children of comment,if any.
        await Comments.deleteMany({ parent: req.params.comment });

        //deleting that comment
        await Comments.deleteOne({ _id: req.params.comment });

        return res.status(200).json({
            success: true,
            message: "comment deleted",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.likeAndUnlikeComment = async (req, res, next) => {
    try {
        const comment = await Comments.findById(req.params.id);
        if (!comment) {
            return next(new ErrorHandler("Comment is not present", 400));
        }

        //unlike comment
        if (comment.likes.includes(req.user._id)) {
            const index = comment.likes.indexOf(req.user._id);
            comment.likes.splice(index, 1);
            await comment.save();

            return res.status(200).json({
                success: true,
                message: "comment unliked successfully",
            });
        } else {
            //comment like

            comment.likes.push(req.user._id);
            await comment.save();
            return res.status(200).json({
                success: true,
                message: "comment liked successfully",
            });
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.findCommentById = async (req, res, next) => {
    try {
        const comment = await Comments.findById(req.params.id)
            .populate("likes post owner parent")
            .populate({
                path: "post",
                populate: [
                    { path: "owner", select: "name handle profile _id" },
                    { path: "likes", select: "_id" },
                ],
            })
            .populate({
                path: "parent",
                populate: [
                    { path: "owner", select: "name handle profile _id" },
                    { path: "likes", select: "_id" },
                ],
            })

            .populate({
                path: "children",
                populate: [
                    { path: "owner", select: "name handle profile _id" },
                    { path: "likes", select: "_id" },
                    { path: "parent" },
                    {
                        path: "children",
                        populate: [
                            { path: "owner", select: "name handle profile _id" },
                            { path: "likes", select: "_id" },
                            { path: "children", populate: [{ path: "owner", select: "name handle profile _id" }] },
                        ],
                    },
                ],
            });

        if (!comment) {
            return next(new ErrorHandler("Comment not found", 404));
        }
        return res.status(200).json({
            message: "success",
            comment,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
async function fetchReplies(commentId, replies) {
    const comment = await Comments.findById(commentId).populate("owner");

    if (!comment) {
        return replies;
    }

    replies.push(comment);

    for (const childReply of comment.children) {
        await fetchReplies(childReply, replies);
    }

    return replies;
}
exports.findRepliesById = async (req, res, next) => {
    try {
        // Fetch all replies in the conversation

        const replies = await fetchReplies(req.params.id, []);

        res.status(200).json({ message: "success", replies });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
