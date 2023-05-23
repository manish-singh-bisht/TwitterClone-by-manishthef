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
//delete all the children of the parent comment if parent is deleted
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
async function fetchReplies(commentId, replies, parentHandle) {
    const comment = await Comments.findById(commentId).populate("owner");
    let handle = comment.owner.handle;

    if (!comment) {
        return replies;
    }

    replies.push(comment);
    flag = 1;

    for (const childReply of comment.children) {
        handle = comment.owner.handle;
        await fetchReplies(childReply, replies, handle);
    }

    return replies;
}
exports.findRepliesById = async (req, res, next) => {
    try {
        // Fetch all replies in the conversation

        const replies = await fetchReplies(req.params.id, [], req.params.handle);

        res.status(200).json({ message: "success", replies });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
