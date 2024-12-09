import cloudinary from "../lib/cloudinary.js";
import { getReceivedId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const usersWithChat = async (req, res) => {
  const myId = req.user._id;

  const messages = await Message.find({$or: [
    {senderId: myId},
    {receivedId: myId}
  ]})

  const users = messages.map((message) => {
    return message.senderId.equals(myId) ? message.receivedId : message.senderId;
  })
  

  // Eliminar duplicados usando Set
  const uniqueUsers = [...new Set(users)];

  const usersWithChat = await User.find({_id: {$in: uniqueUsers}}).select('_id email username profilePic')

  res.status(200).json(usersWithChat)
}

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receivedId: userToChatId },
      { senderId: userToChatId, receivedId: myId },
    ],
  }).sort({ createdAt: 1 });;

  res.status(200).json(messages);
};

//REAL TIME
export const sendMessage = async(req, res) => {
    const { text, image}  = req.body
    const {receivedId} = req.params;
    const myId = req.user._id;

    let imageUrl;
    if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }

    const allMessage = {
        senderId: myId,
        receivedId,
        text,
        image: imageUrl,
    };

    

    const newMessage = new Message(allMessage);
    await newMessage.save();

    const receiverSocketId = getReceivedId(receivedId);
    io.to(receiverSocketId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
} 
