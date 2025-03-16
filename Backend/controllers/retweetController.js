const Posts = require("../models/postModel");
const Users = require("../models/userModel");
const Comments = require("../models/commentModel");
const Retweets = require("../models/retweetsModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.retweetPost = async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.id);
        const user = req.body.user;

        if (!post) {
            return next(new ErrorHandler("Post is not present", 404));
        }

        const checkRetweetAlreadyByUser = await Retweets.findOne({ originalPost: post._id, userRetweeted: user });

        if (checkRetweetAlreadyByUser) {
            const index = post.retweets.indexOf(user);
            post.retweets.splice(index, 1);
            await Retweets.deleteOne({ originalPost: post._id, userRetweeted: user });
            await post.save();

            return res.status(200).json({
                success: true,
                message: "undo retweet successfully",
            });
        }

        await Retweets.create({ originalPost: req.params.id, userRetweeted: user, onModel: "Posts" });
        post.retweets.push(user);

        await post.save();

        return res.status(200).json({
            success: true,
            message: " retweet successfully",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
exports.retweetComment = async (req, res, next) => {
    try {
        const comment = await Comments.findById(req.params.comment);
        const user = req.body.user;

        if (!comment) {
            return next(new ErrorHandler("Post is not present", 404));
        }

        const checkRetweetAlreadyByUser = await Retweets.findOne({ originalPost: comment._id, userRetweeted: user });

        if (checkRetweetAlreadyByUser) {
            const index = comment.retweets.indexOf(user);
            comment.retweets.splice(index, 1);

            await Retweets.deleteOne({ originalPost: comment._id, userRetweeted: user });
            await comment.save();

            return res.status(200).json({
                success: true,
                message: "undo retweet successfully",
            });
        }

        await Retweets.create({ originalPost: comment._id, userRetweeted: user, onModel: "Comments" });
        comment.retweets.push(user);
        await comment.save();

        return res.status(200).json({
            success: true,
            message: " retweet successfully",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
