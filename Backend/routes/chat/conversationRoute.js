const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/auth");
const { createConversation, deleteConversationForYou, getAllConversationsOfTheLoggedInUser } = require("../../controllers/chat/conversationController");

router.route("/create").post(isAuthenticated, createConversation);
router.route("/deleteConversation/:id").delete(isAuthenticated, deleteConversationForYou);
router.route("/getAll").get(isAuthenticated, getAllConversationsOfTheLoggedInUser);

module.exports = router;
