const Conversation = require("../../models/chat/conversationModel");
const Message = require("../../models/chat/messageModel");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.sendMessage = async (req, res, next) => {
    try {
        const { conversationId, senderId, content } = req.body;

        const newMessageData = new Message({
            conversation: conversationId,
            sender: senderId,
            content: content,
        });
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return next(new ErrorHandler("No such Conversation exist", 404));
        }
        const newMessage = await Message.create(newMessageData);

        // Find the receiver's ID
        const receiverId = conversation.participants.find((participant) => participant.toString() !== senderId.toString());
        // Update the latest message references for both the sender and the receiver
        const senderIndex = conversation.latest.findIndex((entry) => entry.userId.equals(senderId));
        const receiverIndex = conversation.latest.findIndex((entry) => entry.userId.equals(receiverId));
        if (senderIndex === -1) {
            conversation.latest.push({ userId: senderId, message: newMessage._id });
        } else {
            conversation.latest[senderIndex].message = newMessage._id;
        }

        if (receiverIndex === -1) {
            conversation.latest.push({ userId: receiverId, message: newMessage._id });
        } else {
            conversation.latest[receiverIndex].message = newMessage._id;
        }

        await conversation.save();

        return res.status(201).json({
            success: true,
            newMessage,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

const handleLatestUpdate = async (conversation, userId, messageId) => {
    const participantIndex = conversation.latest.findIndex((entry) => entry.userId.toString() === userId.toString());

    if (participantIndex === -1) return;
    if (participantIndex !== -1 && conversation.latest[participantIndex].message.toString() !== messageId.toString()) return;

    const previousMessages = await Message.find(
        {
            _id: { $ne: messageId },
            conversation: conversation._id,
            deletedBy: { $ne: userId },
        },
        null,
        { sort: { _id: -1 }, limit: 2 }
    );
    if (previousMessages.length === 0) {
        conversation.latest.splice(participantIndex, 1);
    } else {
        conversation.latest[participantIndex].message = previousMessages[0]._id;
    }
    await conversation.save();
};

exports.deleteMessageForYou = async (req, res, next) => {
    try {
        const { messageId, userId } = req.body;
        const message = await Message.findById(messageId);

        // Soft delete message for the user
        await Message.updateOne({ _id: messageId, deletedBy: { $ne: userId } }, { $addToSet: { deletedBy: userId } });

        const conversation = await Conversation.findById(message.conversation);
        if (!conversation) {
            return next(new ErrorHandler("No such Conversation exist", 400));
        }

        if (message.deletedBy.length + 1 === 2) {
            const receiverId = conversation.participants.find((participant) => participant.toString() !== req.user._id.toString());

            await handleLatestUpdate(conversation, req.user._id, messageId);
            await handleLatestUpdate(conversation, receiverId, messageId);

            await Message.deleteOne({ _id: messageId });
        } else {
            await handleLatestUpdate(conversation, userId, messageId);
        }

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.deleteMessageForAll = async (req, res, next) => {
    try {
        const messageId = req.params.messageId;
        const message = await Message.findOne({ _id: messageId });

        if (!message) {
            return next(new ErrorHandler("No such message", 400));
        }

        const conversation = await Conversation.findById(message.conversation);

        if (!conversation) {
            return next(new ErrorHandler("No such Conversation exist", 400));
        }
        // Find the receiver's ID
        const receiverId = conversation.participants.find((participant) => participant.toString() !== req.user._id.toString());

        await handleLatestUpdate(conversation, req.user._id, messageId);
        await handleLatestUpdate(conversation, receiverId, messageId);
        await Message.deleteOne({ _id: messageId });
        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.getAllMessages = async (req, res, next) => {
    const conversationId = req.params.conversationId;

    try {
        const messages = await Message.find({ conversation: conversationId, deletedBy: { $ne: req.user._id } });
        return res.status(200).json({
            success: true,
            messages: messages,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
