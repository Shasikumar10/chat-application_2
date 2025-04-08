const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");
const User = require("../models/User");

// Access or Create 1-on-1 Chat
router.post("/", protect, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.sendStatus(400);
  }

  let isChat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (isChat) {
    return res.send(isChat);
  }

  const chatData = {
    chatName: "sender",
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
    res.status(200).json(fullChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Chats for a User
router.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({ users: { $in: [req.user._id] } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).send(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
