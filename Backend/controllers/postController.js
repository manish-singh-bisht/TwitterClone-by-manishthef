const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");
const Users = require("../models/userModel");
const Retweets = require("../models/retweetsModel");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");
const sharp = require("sharp");

async function pagination(model, options = {}, req) {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments())) {
        results.next = {
            page: page + 1,
            limit: limit,
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit,
        };
    }

    const query = model
        .find(options.query || {})
        .limit(limit)
        .skip(startIndex)
        .sort(options.sort || {});

    if (options.populate) {
        query.populate(options.populate);
    }

    results.data = await query;

    return results;
}

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
                select: "_id handle name profile description",
            })
            .populate({
                path: "bookmarks",
                select: "_id",
            })
            .populate({ path: "retweets", select: "name handle profile _id description" })

            .populate({ path: "owner", select: "_id handle profile name description" })
            .populate({
                path: "comments",
                populate: [
                    { path: "owner", select: "name handle profile _id description" },
                    { path: "post" },
                    { path: "likes", select: "_id" },
                    { path: "retweets", select: "_id" },
                    { path: "bookmarks", select: "_id" },
                    {
                        path: "children",
                        populate: [
                            { path: "owner", select: "name handle profile _id description" },
                            { path: "likes", select: "_id" },
                            { path: "retweets", select: "_id" },
                            { path: "bookmarks", select: "_id" },
                            { path: "children", populate: [{ path: "owner", select: "name handle profile _id description" }] },
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
    if (user.pinnedTweet?.toString() === post._id.toString()) {
        user.pinnedTweet = null;
    }
    await user.save();

    //delete all retweets instances for the post
    await Retweets.deleteMany({ originalPost: post._id });

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
        //delete all retweets instances for the post's comments
        await Retweets.deleteMany({ originalPost: comment._id });

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
        const posts = await pagination(
            Posts,
            {
                query: {
                    owner: { $in: [...user.following, user._id] },
                    parent: null,
                },
                populate: [
                    {
                        path: "owner",
                        select: "handle name profile _id description",
                    },
                    {
                        path: "likes",
                        select: "_id handle name profile",
                    },
                    {
                        path: "retweets",
                        select: "_id handle name profile",
                    },
                    {
                        path: "bookmarks",
                        select: "_id",
                    },
                ],
                sort: { createdAt: -1 },
            },
            req
        );

        //Line below will bring all retweets of the users that are being followed by the logged in user.

        const retweets = await pagination(
            Retweets,
            {
                query: {
                    userRetweeted: { $in: [...user.following] },
                },
                populate: [
                    {
                        path: "originalPost",
                        populate: [
                            { path: "owner", select: "handle name profile _id description" },
                            { path: "likes", select: "_id handle name profile" },
                            { path: "bookmarks", select: "_id" },
                            { path: "retweets", select: "_id handle name profile" },
                        ],
                    },
                    { path: "userRetweeted", select: "_id name handle" },
                ],
                sort: { createdAt: -1 },
            },
            req
        );

        const combined = [...retweets.data, ...posts.data];
        combined.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json({
            success: true,
            posts: combined,
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
            select: "_id handle name profile",
        })
        .populate({
            path: "bookmarks",
            select: "_id",
        })
        .populate({ path: "owner", select: "_id handle profile name description" })
        .populate({
            path: "comments",
            populate: [
                { path: "owner", select: "name handle profile _id description" },
                { path: "post" },
                { path: "likes", select: "_id" },
                { path: "bookmarks", select: "_id" },
                { path: "retweets", select: "_id" },
                {
                    path: "children",
                    populate: [
                        { path: "owner", select: "name handle profile _id description" },
                        { path: "likes", select: "_id" },
                        { path: "retweets", select: "_id" },
                        { path: "bookmarks", select: "_id" },
                        { path: "children", populate: [{ path: "owner", select: "name handle profile _id description" }] },
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

exports.bookmarkPosts = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) {
            return next(new ErrorHandler("Post is not present", 404));
        }

        //undo bookmark post
        if (post.bookmarks.includes(req.user._id)) {
            const index = post.bookmarks.indexOf(req.user._id);
            post.bookmarks.splice(index, 1);
            await post.save();

            return res.status(200).json({
                success: true,
                message: "Tweet removed from your Bookmarks",
            });
        } else {
            //post bookmarked

            post.bookmarks.push(req.user._id);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Tweet added to your Bookmarks",
            });
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.getBookMarks = async (req, res, next) => {
    try {
        const user = await Users.findById(req.params.id);

        const posts = await pagination(
            Posts,
            {
                query: {
                    bookmarks: user._id,
                },
                populate: [
                    { path: "owner", select: "handle name profile _id description" },

                    { path: "likes", select: "_id handle name profile" },

                    { path: "retweets", select: "_id handle name profile" },

                    { path: "bookmarks", select: "_id" },
                ],
                sort: { createdAt: -1 },
            },
            req
        );
        const comments = await pagination(
            Comments,
            {
                query: {
                    bookmarks: user._id,
                },
                populate: [
                    { path: "owner", select: "handle name profile _id description" },

                    { path: "likes", select: "_id handle name profile" },

                    { path: "retweets", select: "_id handle name profile" },

                    { path: "bookmarks", select: "_id" },
                ],
                sort: { createdAt: -1 },
            },
            req
        );

        const combined = [...comments.data, ...posts.data];
        combined.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json({
            success: true,
            posts: combined,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
exports.deleteAllBookmarks = async (req, res, next) => {
    try {
        const user = await Users.findById(req.params.id);

        // Remove bookmarks from Posts
        await Posts.updateMany({ bookmarks: user._id }, { $pull: { bookmarks: user._id } });

        // Remove bookmarks from Comments
        await Comments.updateMany({ bookmarks: user._id }, { $pull: { bookmarks: user._id } });

        res.status(200).json({
            success: true,
            message: "All bookmarks have been deleted for the user.",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.getPostsofUser = async (req, res, next) => {
    try {
        const userArr = await Users.find({ handle: req.params.id }); //id is handle here
        const user = userArr[0];
        let pinnedTweet;
        const page = parseInt(req.query.page || 1);

        if (!user) {
            return next(new ErrorHandler("No such user", 400));
        }

        if (user.pinnedTweet && page === 1) {
            pinnedTweet = await Posts.findById(user.pinnedTweet)
                .populate({
                    path: "owner",
                    select: "handle name profile _id description",
                })
                .populate({
                    path: "likes",
                    select: "_id handle name profile",
                })
                .populate({
                    path: "retweets",
                    select: "_id handle name profile",
                })
                .populate({
                    path: "bookmarks",
                    select: "_id",
                });
        }
        const posts = await pagination(
            Posts,
            {
                query: {
                    owner: { $in: user._id },
                    parent: null,
                },
                populate: [
                    {
                        path: "owner",
                        select: "handle name profile _id description",
                    },
                    {
                        path: "likes",
                        select: "_id handle name profile",
                    },
                    {
                        path: "retweets",
                        select: "_id handle name profile",
                    },
                    {
                        path: "bookmarks",
                        select: "_id",
                    },
                ],
                sort: { createdAt: -1 },
            },
            req
        );

        const retweets = await pagination(
            Retweets,
            {
                query: {
                    userRetweeted: { $in: user._id },
                },
                populate: [
                    {
                        path: "originalPost",
                        populate: [
                            { path: "owner", select: "handle name profile _id description" },
                            { path: "likes", select: "_id handle name profile" },
                            { path: "bookmarks", select: "_id" },
                            { path: "retweets", select: "_id handle name profile" },
                        ],
                    },
                    { path: "userRetweeted", select: "_id name handle" },
                ],
            },
            req
        );

        let combined = [...posts.data];

        if (pinnedTweet) {
            const pinnedIndex = combined.findIndex((tweet) => tweet._id.toString() === pinnedTweet._id.toString());
            if (pinnedIndex !== -1) {
                combined.splice(pinnedIndex, 1);
            }
        }
        combined = [...retweets.data, ...combined];
        combined.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json({
            success: true,
            posts: pinnedTweet ? [pinnedTweet, ...combined] : combined,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
exports.getPostLikedByUser = async (req, res, next) => {
    try {
        const userArr = await Users.find({ handle: req.params.id }); //id is handle here
        const user = userArr[0];
        if (!user) {
            return next(new ErrorHandler("No such user", 400));
        }
        const posts = await pagination(
            Posts,
            {
                query: {
                    likes: { $in: user._id },
                },
                populate: [
                    {
                        path: "owner",
                        select: "handle name profile _id description",
                    },
                    {
                        path: "likes",
                        select: "_id handle name profile",
                    },
                    {
                        path: "retweets",
                        select: "_id handle name profile",
                    },
                    {
                        path: "bookmarks",
                        select: "_id",
                    },
                ],
                sort: { createdAt: -1 },
            },
            req
        );
        const comments = await pagination(
            Comments,
            {
                query: {
                    likes: { $in: user._id },
                },
                populate: [
                    { path: "owner", select: "handle name profile _id description" },

                    { path: "likes", select: "_id handle name profile" },

                    { path: "retweets", select: "_id handle name profile" },

                    { path: "bookmarks", select: "_id" },
                ],
                sort: { createdAt: -1 },
            },
            req
        );

        const combined = [...comments.data, ...posts.data];
        combined.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json({
            success: true,
            posts: combined,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.getPostOfUserWithMedia = async (req, res, next) => {
    try {
        const userArr = await Users.find({ handle: req.params.id }); //id is handle here

        const user = userArr[0];
        if (!user) {
            return next(new ErrorHandler("No such user", 400));
        }
        const posts = await pagination(
            Posts,
            {
                query: {
                    $and: [{ owner: user._id }, { images: { $gt: [] } }],
                },
                populate: [
                    {
                        path: "owner",
                        select: "handle name profile _id description",
                    },
                    {
                        path: "likes",
                        select: "_id handle name profile",
                    },
                    {
                        path: "retweets",
                        select: "_id handle name profile",
                    },
                    {
                        path: "bookmarks",
                        select: "_id",
                    },
                ],
                sort: { createdAt: -1 },
            },
            req
        );
        const comments = await pagination(
            Comments,
            {
                query: {
                    $and: [{ owner: user._id }, { images: { $gt: [] } }],
                },
                populate: [
                    { path: "owner", select: "handle name profile _id description" },

                    { path: "likes", select: "_id handle name profile" },

                    { path: "retweets", select: "_id handle name profile" },

                    { path: "bookmarks", select: "_id" },
                ],
                sort: { createdAt: -1 },
            },
            req
        );

        const combined = [...comments.data, ...posts.data];
        combined.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json({
            success: true,
            posts: combined,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
