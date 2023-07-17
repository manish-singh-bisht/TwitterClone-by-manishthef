const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");
const Users = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");
const sharp = require("sharp");

exports.createPost = async (req, res, next) => {
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

        const user = await Users.findById({ _id: req.user._id });

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        const newData = {
            tweet: req.body.tweet,
            images: uploadedImages,
            owner: req.user._id,
            mentions: req.body.mentions,
            parent: req.body.parent,
            threadIdForTweetInThread: req.body.threadIdForTweetInThread,
        };
        const owner = await Users.findById(newData.owner).select("name handle _id profile");
        newData.owner = owner;

        if (newData.parent !== null) {
            const parentTweet = await Posts.findOne({ threadIdForTweetInThread: newData.parent });

            if (!parentTweet) {
                return next(new ErrorHandler("parent tweet not found", 404));
            }
            const createNewPost = await Posts.create(newData);

            //Finding user and pushing the post id into the user's post array.
            user.posts.unshift(createNewPost._id);
            await user.save();

            parentTweet.children.unshift(createNewPost._id);
            await parentTweet.save();

            return res.status(201).json({
                success: true,
            });
        }
        const createNewPost = await Posts.create(newData);

        //Finding user and pushing the post id into the user's post array.
        user.posts.unshift(createNewPost._id);
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Your Tweet was sent.",
            createNewPost,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.findPostById = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id)
            .populate("comments")
            .populate({
                path: "likes",
                select: "_id handle name profile",
            })
            .populate({
                path: "retweets",

                populate: {
                    path: "user",

                    select: "_id handle name profile",
                },
            })
            .populate({ path: "owner", select: "_id handle profile name" })
            .populate({
                path: "comments",
                populate: [
                    { path: "owner", select: "name handle profile _id" },
                    { path: "post" },
                    { path: "likes", select: "_id" },
                    { path: "retweets", populate: { path: "user", select: "_id" } },
                    {
                        path: "children",
                        populate: [
                            { path: "owner", select: "name handle profile _id" },
                            { path: "likes", select: "_id" },
                            { path: "retweets", populate: { path: "user", select: "_id" } },
                            { path: "children", populate: [{ path: "owner", select: "name handle profile _id" }] },
                        ],
                    },
                ],
            });
        if (!post) {
            return next(new ErrorHandler("Post not found", 404));
        }

        const mentionsHandleCollection = [];
        post.mentions.forEach((mention) => {
            if (mention !== req.user.handle) {
                mentionsHandleCollection.push(mention);
            }
        });
        if (post.owner.handle !== req.user.handle) {
            mentionsHandleCollection.push(post.owner.handle);
        }
        const uniqueMentionHandleCollection = [...new Set(mentionsHandleCollection)];

        return res.status(200).json({
            message: "success",
            post,
            uniqueMentionHandleCollection,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.likeAndUnlikePost = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) {
            return next(new ErrorHandler("Post is not present", 404));
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
            return next(new ErrorHandler("Post not found", 404));
        }
        await recursivePostDelete(post);

        return res.status(200).json({
            success: true,
            message: "Your Tweet was deleted",
            post,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
const recursivePostDelete = async (post) => {
    // Delete children recursively
    for (const childId of post.children) {
        const childTweet = await Posts.findById(childId);
        if (childTweet) {
            await recursivePostDelete(childTweet);
        }
    }
    const user = await Users.findById({ _id: post.owner });
    // Remove the post from its parent's children array
    if (post.parent) {
        const parentTweet = await Posts.findOne({ threadIdForTweetInThread: post.parent });
        if (parentTweet) {
            parentTweet.children = parentTweet.children.filter((childId) => childId.toString() !== post._id.toString());
            await parentTweet.save();
        }
    }
    // Remove the post from the user's posts array
    user.posts = user.posts.filter((item) => item._id.toString() !== post._id.toString());
    await user.save();

    // Delete comments and their children recursively
    for (const commentId of post.comments) {
        await deleteCommentRecursive(commentId);
    }
    //deleting all comments in the post
    await Comments.deleteMany({ post: post._id });

    //deleting images from cloud
    for (const image of post.images) {
        await cloudinary.v2.uploader.destroy(image.public_id);
    }
    await post.deleteOne({ _id: post._id });
};

const deleteCommentRecursive = async (commentId) => {
    const comment = await Comments.findById(commentId);
    if (comment) {
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

        //deleting images from cloud
        for (const image of comment.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }

        // Remove the comment from the user's comments array
        user.comments = user.comments.filter((item) => item._id.toString() !== comment._id.toString());
        await user.save();
    }
};

exports.getPostofFollowingAndMe = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user._id);

        //Line below will bring all posts of the users that are being followed by the logged in user along with the loggedIn user's post.
        const posts = await Posts.find({ owner: { $in: [...user.following, user._id] }, parent: null })
            .populate({
                path: "owner",
                select: "handle name profile",
            })
            .populate({
                path: "likes",
                select: "_id handle name profile",
            })
            .populate({
                path: "retweets",

                populate: {
                    path: "user",
                    select: "_id handle name profile",
                },
            })
            .sort({ createdAt: -1 });

        // //Line below will bring all retweets of the users that are being followed by the logged in user along with the loggedIn user's retweets.
        // const retweets = await Posts.find({ retweets: { user: { $in: [...user.following, user._id] } }, parent: null })
        //     .populate({
        //         path: "owner",
        //         select: "handle name profile",
        //     })
        //     .populate({
        //         path: "likes",
        //         select: "_id handle name profile",
        //     })
        //     .populate({
        //         path: "retweets",
        //         populate: {
        //             path: "user",
        //             select: "_id handle name profile",
        //         },
        //     })
        //     .sort({ createdAt: -1 });

        // const combined = [...retweets, ...posts];

        res.status(200).json({
            success: true,
            posts: posts,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.findThread = async (req, res, next) => {
    try {
        const thread = await fetchThread(req.params.id, [], req.user.handle);

        res.status(200).json({ message: "success", thread });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
async function fetchThread(postId, thread, userHandle) {
    const post = await Posts.findById(postId)
        .populate("comments")
        .populate({
            path: "likes",
            select: "_id handle name profile",
        })
        .populate({
            path: "retweets",

            populate: {
                path: "user",
                select: "_id handle name profile",
            },
        })
        .populate({ path: "owner", select: "_id handle profile name" })
        .populate({
            path: "comments",
            populate: [
                { path: "owner", select: "name handle profile _id" },
                { path: "post" },
                { path: "likes", select: "_id" },
                { path: "retweets", populate: { path: "user", select: "_id" } },
                {
                    path: "children",
                    populate: [
                        { path: "owner", select: "name handle profile _id" },
                        { path: "likes", select: "_id" },
                        { path: "retweets", populate: { path: "user", select: "_id" } },
                        { path: "children", populate: [{ path: "owner", select: "name handle profile _id" }] },
                    ],
                },
            ],
        });

    if (!post) {
        return thread;
    }
    const mentionsHandleCollection = [];
    post.mentions.forEach((mention) => {
        if (mention !== userHandle) {
            mentionsHandleCollection.push(mention);
        }
    });
    if (post.owner.handle !== userHandle) {
        mentionsHandleCollection.push(post.owner.handle);
    }
    const uniqueMentionHandleCollection = [...new Set(mentionsHandleCollection)];
    thread.push({ post, uniqueMentionHandleCollection: uniqueMentionHandleCollection });

    for (const child of post.children) {
        await fetchThread(child, thread, userHandle);
    }

    return thread;
}

exports.retweetPost = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id);

        if (!post) {
            return next(new ErrorHandler("Post is not present", 404));
        }

        const retweetIndex = post.retweets.findIndex((retweet) => retweet.user.toString() === req.user._id.toString());

        if (retweetIndex !== -1) {
            // Undo retweetPost
            post.retweets.splice(retweetIndex, 1);
            await post.save();

            return res.status(200).json({
                success: true,
                message: "Undo retweetPost successfully",
            });
        } else {
            // RetweetPost
            post.retweets.push({ user: req.user._id });
            await post.save();

            return res.status(200).json({
                success: true,
                message: "RetweetPost successfully",
            });
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
