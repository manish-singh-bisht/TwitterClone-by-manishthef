const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const { retweetPost, retweetComment } = require("../controllers/retweetController");

router.route("/:id").post(isAuthenticated, retweetPost);
router.route("/comment/:comment").post(isAuthenticated, retweetComment);

module.exports = router;
