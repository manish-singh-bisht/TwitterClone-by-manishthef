const Comments = require("../models/commentModel");
const Posts = require("../models/postModel");
const Users = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createPost = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user._id);

        const newData = {
            tweet: req.body.tweet,
            images: req.body.images,
            owner: req.user._id,
            mentions: req.body.mentions,
            parent: req.body.parent,
        };
        if (newData.parent) {
            const parentTweet = await Posts.findById(newData.parent);
            const createNewPost = await Posts.create(newData);
            //Finding user and pushing the post id into the user's post array.

            user.posts.unshift(createNewPost._id);
            await user.save();

            parentTweet.children.unshift(createNewPost._id);
            await parentTweet.save();

            return res.status(201).json({
                success: true,
                createNewPost,
            });
        }
        const createNewPost = await Posts.create(newData);

        //Finding user and pushing the post id into the user's post array.
        user.posts.unshift(createNewPost._id);
        await user.save();

        return res.status(201).json({
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
                populate: [
                    { path: "owner", select: "name handle profile _id" },
                    { path: "post" },
                    { path: "likes", select: "_id" },
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
        const user = await Users.findById(req.user._id);
        if (!post) {
            return next(new ErrorHandler("Post not found", 404));
        }
        await recursivePostDelete(post, user);

        return res.status(200).json({
            success: true,
            message: "tweet deleted",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
const recursivePostDelete = async (post, user) => {
    // Delete children recursively
    for (const childId of post.children) {
        const childTweet = await Posts.findById(childId);
        if (childTweet) {
            await recursivePostDelete(childTweet, user);
        }
    }
    // Remove the post from its parent's children array
    if (post.parent) {
        const parentTweet = await Posts.findById(post.parent);
        if (parentTweet) {
            parentTweet.children = parentTweet.children.filter((childId) => childId.toString() !== post._id.toString());
            await parentTweet.save();
        }
    }
    // Remove the post from the user's posts array
    user.posts = user.posts.filter((item) => item._id.toString() !== post._id.toString());
    await user.save();

    //deleting all comments in the post
    await Comments.deleteMany({ post: post._id });

    await post.deleteOne({ _id: post._id });
};

exports.getPostofFollowingAndMe = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user._id);

        //Line below will bring all posts of the users that are being followed by the logged in user.
        const posts = await Posts.find({ owner: { $in: [...user.following, user._id] }, parent: null }).populate("owner likes comments");
        res.status(200).json({
            success: true,
            posts: posts.reverse(),
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
