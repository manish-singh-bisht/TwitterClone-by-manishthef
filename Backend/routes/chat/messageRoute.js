const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/auth");
const { sendMessage, deleteMessageForYou, deleteMessageForAll, getAllMessages } = require("../../controllers/chat/messageController");

router.route("/message/create").post(isAuthenticated, sendMessage);
router.route("/message/deleteMessage").delete(isAuthenticated, deleteMessageForYou);
router.route("/message/deleteForAll/:messageId").delete(isAuthenticated, deleteMessageForAll);
router.route("/message/getAll/:conversationId").get(isAuthenticated, getAllMessages);

module.exports = router;
