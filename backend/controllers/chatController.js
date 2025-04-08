const Chat = require('../models/Chat');
const User = require('../models/User');

exports.accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.sendStatus(400);

  let isChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate('users', '-password').populate('latestMessage');

  if (isChat) return res.send(isChat);

  const chatData = {
    chatName: 'sender',
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id).populate('users', '-password');
    res.status(200).send(fullChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    res.status(200).send(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
