const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");
const Users = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");
const sharp = require("sharp");

//adding comment on a post
exports.postComment = async (req, res, next) => {
    try {
        const images = req.body.images;

        const uploadedImages = await Promise.all(
            images.map(async (image) => {
                const base64Buffer = Buffer.from(image.substring(22), "base64");
                const originalSizeInBytes = base64Buffer.length;
                const originalSizeInKB = originalSizeInBytes / 1024;

                if (originalSizeInKB > 100) {
                    const { format, width } = await sharp(base64Buffer).metadata();

                    const compressedBuffer = await sharp(base64Buffer)
                        .toFormat(format)
                        .resize({ width: Math.floor(width * 0.5) })
                        .webp({ quality: 50, chromaSubsampling: "4:4:4" })
                        .toBuffer();

                    const compressedBase64 = compressedBuffer.toString("base64");

                    const result = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${compressedBase64}`, {
                        folder: "twitterClone",
                    });
                    return result;
                } else {
                    const result = await cloudinary.v2.uploader.upload(image, {
                        folder: "twitterClone",
                    });
                    return result;
                }
            })
        );
        const post = await Posts.findById(req.params.id).populate("comments");
        const user = await Users.findById(req.user._id);
        if (!post) {
            return next(new ErrorHandler("post not found", 404));
        }
        const newData = {
            comment: req.body.comment,
            images: uploadedImages,
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
                message: "Whoops! You already said that.",
            });
        }
        if (newData.parent) {
            const parentComment = await Comments.findById(newData.parent).populate("children");

            if (!parentComment) {
                return next(new ErrorHandler("parent comment not found", 404));
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
                    message: "Whoops! You already said that.",
                });
            }

            const newCreateComment = await Comments.create(newData);

            parentComment.children.unshift(newCreateComment._id);
            await parentComment.save();

            user.comments.unshift(newCreateComment._id);
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Your Tweet was sent.",
            });
        }
        const newCreateComment = await Comments.create(newData);

        post.comments.unshift(newCreateComment._id);
        await post.save();

        user.comments.unshift(newCreateComment._id);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Your Tweet was sent.",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const postId = req.params.post;
        const commentId = req.params.comment;

        const post = await Posts.findById(postId);

        if (!post) {
            return next(new ErrorHandler("Post not found", 404));
        }

        const commentToDelete = await Comments.findById(commentId);

        if (!commentToDelete) {
            return next(new ErrorHandler("Comment not found", 404));
        }

        // Delete the comment and its children recursively
        await deleteCommentRecursive(commentToDelete);

        // Remove the comment from the post's comments array
        post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId);
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Your Tweet was deleted",
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
    const user = await Users.findById({ _id: comment.owner });
    // Remove the comment from its parent's children array
    if (comment.parent) {
        const parentComment = await Comments.findById(comment.parent);
        if (parentComment) {
            parentComment.children = parentComment.children.filter((childId) => childId.toString() !== comment._id.toString());
            await parentComment.save();
        }
    }

    // Remove the comment from the user's comments array
    user.comments = user.comments.filter((item) => item._id.toString() !== comment._id.toString());
    await user.save();

    //deleting images from cloud
    for (const image of comment.images) {
        await cloudinary.v2.uploader.destroy(image.public_id);
    }
    // Delete the comment itself
    await Comments.deleteOne({ _id: comment._id });
};

exports.likeAndUnlikeComment = async (req, res, next) => {
    try {
        const comment = await Comments.findById(req.params.id);
        if (!comment) {
            return next(new ErrorHandler("Comment is not present", 404));
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
        const loggedInUserHandle = req.user.handle;
        const comment = await Comments.findById(req.params.id)
            .populate("post parent")
            .populate({ path: "retweets", select: "name handle profile _id" })
            .populate({ path: "likes", select: "name handle  _id" })
            .populate({ path: "owner", select: "name handle _id" })
            .populate({
                path: "post",
                populate: [
                    { path: "owner", select: "name handle profile _id" },
                    { path: "likes", select: "_id" },
                    { path: "retweets", select: "_id" },
                ],
            })
            .populate({
                path: "parent",
                populate: [
                    { path: "owner", select: "name handle profile _id" },
                    { path: "likes", select: "_id" },
                    { path: "retweets", select: "_id" },
                ],
            })

            .populate({
                path: "children",
                populate: [
                    { path: "owner", select: "name handle profile _id" },
                    { path: "likes", select: "_id" },
                    { path: "retweets", select: "_id" },
                    { path: "parent" },
                    {
                        path: "children",
                        populate: [
                            { path: "owner", select: "name handle profile _id" },
                            { path: "likes", select: "_id" },
                            { path: "retweets", select: "_id" },
                            { path: "children", populate: [{ path: "owner", select: "name handle profile _id" }] },
                        ],
                    },
                ],
            });

        if (!comment) {
            return next(new ErrorHandler("Comment not found", 404));
        }
        const mentionsHandleCollection = await mentionsHandleCollector(req.params.id, [], loggedInUserHandle);
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
    const comment = await Comments.findById(commentId).populate({ path: "owner", select: "_id handle profile name" }).populate({ path: "likes", select: "_id handle profile name" }).populate({ path: "retweets", select: "_id handle profile name" });

    if (!comment) {
        return replies;
    }

    replies.push(comment);

    for (const childReply of comment.children) {
        await fetchReplies(childReply, replies);
    }

    return replies;
}
async function mentionsHandleCollector(commentId, mentions, loggedInUserHandle) {
    const comment = await Comments.findById(commentId)
        .populate("owner post")
        .populate({
            path: "post",
            populate: [{ path: "owner", select: "name handle profile _id" }],
        });

    if (!comment) {
        return mentions;
    }
    if (comment.owner.handle !== loggedInUserHandle) {
        mentions.push(comment.owner.handle);
    }

    if (comment.post && comment.post.owner) {
        if (comment.post.owner.handle !== loggedInUserHandle) {
            mentions.push(comment.post.owner.handle);
        }
    }

    comment.mentions.forEach((mention) => {
        if (mention !== loggedInUserHandle) {
            mentions.push(mention);
        }
    });

    if (comment.parent) {
        await mentionsHandleCollector(comment.parent, mentions, loggedInUserHandle);
    }

    const uniqueMentions = [...new Set(mentions)];
    return uniqueMentions;
}

exports.retweetComment = async (req, res, next) => {
    try {
        const comment = await Comments.findById(req.params.comment);

        if (!comment) {
            return next(new ErrorHandler("Post is not present", 404));
        }

        //undo retweetComment
        if (comment.retweets.includes(req.user._id)) {
            const index = comment.retweets.indexOf(req.user._id);
            comment.retweets.splice(index, 1);
            await comment.save();

            return res.status(200).json({
                success: true,
                message: "undo retweetComment successfully",
            });
        } else {
            //retweetComment

            comment.retweets.push(req.user._id);
            await comment.save();
            return res.status(200).json({
                success: true,
                message: "retweetComment successfully",
            });
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
