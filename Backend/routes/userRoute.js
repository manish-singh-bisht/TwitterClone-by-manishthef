const express = require("express");
const {
    register,
    login,
    followingOrFollow,
    logout,
    updatePassword,
    updateProfile,
    myProfile,
    profileOfUsers,
    getAllUsers,
    searchUser,
    followingOfUser,
    followersOfUser,
    createPinnedTweet,
    removePinnedTweet,
    updatePinnedTweet,
    createPinnedConversation,
    removePinnedConversation,
    updatePinnedConversation,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/update/password").put(isAuthenticated, updatePassword);
router.route("/update/profile").put(isAuthenticated, updateProfile);
router.route("/me").get(isAuthenticated, myProfile);
router.route("/users").get(isAuthenticated, getAllUsers);
router.route("/search/:handle").get(isAuthenticated, searchUser);
router.route("/follow/:id").get(isAuthenticated, followingOrFollow);
router.route("/user/:id").get(isAuthenticated, profileOfUsers);
router.route("/following/:id").get(isAuthenticated, followingOfUser);
router.route("/followers/:id").get(isAuthenticated, followersOfUser);
router.route("/pinTweet/:id/:tweetId").get(isAuthenticated, createPinnedTweet).put(isAuthenticated, updatePinnedTweet);
router.route("/unpinTweet/:id/:tweetId").get(isAuthenticated, removePinnedTweet);
router.route("/pinConversation/:handle/:id").get(isAuthenticated, createPinnedConversation).put(isAuthenticated, updatePinnedConversation);
router.route("/unpinConversation/:handle/:id").get(isAuthenticated, removePinnedConversation);
module.exports = router;
