const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const { postComment, deleteComment, likeAndUnlikeComment, findCommentById, findRepliesById, commentBookmark, getRepliesofUser } = require("../controllers/commentController");

router.route("/post/comment/:id").post(isAuthenticated, postComment);
router.route("/:post/:comment").delete(isAuthenticated, deleteComment);
router.route("/post/comment/:id").get(isAuthenticated, likeAndUnlikeComment);
router.route("/comment/:id").get(isAuthenticated, findCommentById);
router.route("/comment/reply/:id").get(isAuthenticated, findRepliesById);
router.route("/comment/:id/bookmark").get(isAuthenticated, commentBookmark);
router.route("/getReply/:id").get(isAuthenticated, getRepliesofUser);

module.exports = router;
