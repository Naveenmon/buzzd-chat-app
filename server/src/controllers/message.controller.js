import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedUser = req.user._id;
        const filteredUser = await User.find({_id: {$ne: loggedUser}}).select("-password");
        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("Error in getUserForSidebar", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}


export const getMessages = async (req, res) => {
    try{
        const { id:userToChatID } = req.params.id;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: userToChatID },
                { senderId:userToChatID, receiver: senderId }
            ]
        })

        res.status(200).json(message)

    } catch (error){
        console.log("Error in getMessages", error.message)
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const sendMessage = async (req, res) => {
    try{
        const { text, image } = req.body;
        const { id: receiverId } = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "chat",
                resource_type: "image",
            })
            imageUrl = uploadResponse.secure_url;
        }   

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();
        //todo: realtime functionality goes here

        res.status(200).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}