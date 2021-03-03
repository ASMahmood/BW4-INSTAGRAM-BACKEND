const express = require("express");
const { authenticate } = require("../authenticate");
const router = express.Router();
const userRoute = require("./users");
const postRoute = require("./posts");
const replyRoute = require("./reply");
const commentRoute = require("./comments");
const likeRoute = require("./like");
const followRoute = require("./follow");
const commentLikeRoute = require("./commentlikes");
const storyRoute = require("./story");

router.use("/users", userRoute);
router.use("/posts", authenticate, postRoute);
router.use("/reply", authenticate, replyRoute);
router.use("/comments", authenticate, commentRoute);
router.use("/like", authenticate, likeRoute);
router.use("/follow", authenticate, followRoute);
router.use("/commentlike", authenticate, commentLikeRoute);
router.use("/story", authenticate, storyRoute);
module.exports = router;
