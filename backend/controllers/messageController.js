const Message = require('../models/Message');
const Chat = require('../models/Chat');

// @desc Send a new message
exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    // Create message
    const newMessage = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    // Update the latest message of the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

    // Populate the message with the sender details
    const fullMessage = await Message.findById(newMessage._id).populate('sender', 'name email');

    res.status(200).json(fullMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all messages in a chat
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email profilePic')
      .sort({ createdAt: 'asc' });

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
