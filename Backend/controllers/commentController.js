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
            mentions: req.body.mentions,
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
        const postId = req.params.post;
        const commentId = req.params.comment;

        const post = await Posts.findById(postId).populate("comments");

        if (!post) {
            return next(new ErrorHandler("Post not found", 400));
        }

        const commentToDelete = await Comments.findById(commentId);

        if (!commentToDelete) {
            return next(new ErrorHandler("Comment not found", 400));
        }

        // Delete the comment and its children recursively
        await deleteCommentRecursive(commentToDelete);

        // Remove the comment from the post's comments array
        post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId);
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Comment deleted",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

const deleteCommentRecursive = async (comment) => {
    // Delete children recursively
    for (const childId of comment.children) {
        const childComment = await Comments.findById(childId);
        if (childComment) {
            await deleteCommentRecursive(childComment);
        }
    }

    // Remove the comment from its parent's children array
    if (comment.parent) {
        const parentComment = await Comments.findById(comment.parent);
        if (parentComment) {
            parentComment.children = parentComment.children.filter((childId) => childId.toString() !== comment._id.toString());
            await parentComment.save();
        }
    }

    // Delete the comment itself
    await Comments.deleteOne({ _id: comment._id });
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
        const mentionsHandleCollection = await mentionsHandleCollector(req.params.id, []);
        return res.status(200).json({
            message: "success",
            comment,
            mentionsHandleCollection,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.findRepliesById = async (req, res, next) => {
    try {
        // Fetch all replies in the conversation

        const replies = await fetchReplies(req.params.id, []);

        res.status(200).json({ message: "success", replies });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
async function fetchReplies(commentId, replies) {
    const comment = await Comments.findById(commentId).populate("owner likes");

    if (!comment) {
        return replies;
    }

    replies.push(comment);

    for (const childReply of comment.children) {
        await fetchReplies(childReply, replies);
    }

    return replies;
}
async function mentionsHandleCollector(commentId, mentions) {
    const comment = await Comments.findById(commentId)
        .populate("owner post")
        .populate({
            path: "post",
            populate: [{ path: "owner", select: "name handle profile _id" }],
        });

    if (!comment) {
        return mentions;
    }

    mentions.push(comment.owner.handle);

    if (comment.post && comment.post.owner) {
        mentions.push(comment.post.owner.handle);
    }

    comment.mentions.forEach((mention) => {
        mentions.push(mention);
    });

    if (comment.parent) {
        await mentionsHandleCollector(comment.parent, mentions);
    }

    const uniqueMentions = [...new Set(mentions)];
    return uniqueMentions;
}
