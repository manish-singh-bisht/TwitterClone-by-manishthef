const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const {
    createPost,
    likeAndUnlikePost,
    deletePost,
    findPostById,
    getPostofFollowingAndMe,
    findThread,
    bookmarkPosts,
    getBookMarks,
    deleteAllBookmarks,
    getPostsofUser,
    getPostLikedByUser,
    getPostOfUserWithMedia,
} = require("../controllers/postController");

router.route("/post/upload").post(isAuthenticated, createPost);
router.route("/post/:id").get(isAuthenticated, likeAndUnlikePost).delete(isAuthenticated, deletePost);
router.route("/posts").get(isAuthenticated, getPostofFollowingAndMe);
router.route("/:id").get(isAuthenticated, findPostById);
router.route("/:id/thread").get(isAuthenticated, findThread);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPosts);
router.route("/getBookmarks/:id").get(isAuthenticated, getBookMarks);
router.route("/deleteAllBookmarks/:id").delete(isAuthenticated, deleteAllBookmarks);
router.route("/getTweets/:id").get(isAuthenticated, getPostsofUser);
router.route("/getLikedPost/:id").get(isAuthenticated, getPostLikedByUser);
router.route("/getPostWithMedia/:id").get(isAuthenticated, getPostOfUserWithMedia);
module.exports = router;
