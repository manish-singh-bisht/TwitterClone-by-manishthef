const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const { createPost, likeAndUnlikePost, deletePost, getPostofFollowing, postComment, deleteComment, findPostById } = require("../controllers/postController");

router.route("/post/upload").post(isAuthenticated, createPost);
router.route("/post/:id").get(isAuthenticated, likeAndUnlikePost).delete(isAuthenticated, deletePost);
router.route("/posts").get(isAuthenticated, getPostofFollowing);
router.route("/post/comment/:id").put(isAuthenticated, postComment);
router.route("/post/comment/:id").delete(isAuthenticated, deleteComment);
router.route("/:id").get(isAuthenticated, findPostById);

module.exports = router;
