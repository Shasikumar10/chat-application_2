const accessChat = async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).send('UserId param not sent with request');
    }
  
    let isChat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');
  
    isChat = await User.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'name email',
    });
  
    if (isChat) {
      res.send(isChat);
    } else {
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      };
  
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          'users',
          '-password'
        );
        res.status(200).send(FullChat);
      } catch (error) {
        res.status(400).send(error.message);
      }
    }
  };
  
  const fetchChats = async (req, res) => {
    try {
      const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 });
  
      const result = await User.populate(chats, {
        path: 'latestMessage.sender',
        select: 'name email',
      });
  
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
  
  module.exports = { accessChat, fetchChats };
  