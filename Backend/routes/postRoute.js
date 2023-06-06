const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const { createPost, likeAndUnlikePost, deletePost, findPostById, getPostofFollowingAndMe } = require("../controllers/postController");

router.route("/post/upload").post(isAuthenticated, createPost);
router.route("/post/:id").get(isAuthenticated, likeAndUnlikePost).delete(isAuthenticated, deletePost);
router.route("/posts").get(isAuthenticated, getPostofFollowingAndMe);
router.route("/:id").get(isAuthenticated, findPostById);

module.exports = router;
