const Conversation = require("../../models/chat/conversationModel");
const Message = require("../../models/chat/messageModel");
const Users = require("../../models/userModel");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.createConversation = async (req, res, next) => {
    try {
        const { senderId, receiverId } = req.body;

        if (!receiverId || !senderId) {
            return next(new ErrorHandler("Invalid participants", 500));
        }
        const existingConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (existingConversation) {
            return next(new ErrorHandler("Conversation Already Exists", 500));
        } else {
            const newConversation = await Conversation.create({ participants: [senderId, receiverId] });
            return res.status(201).json({
                success: true,
                newConversation,
            });
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.deleteConversationForYou = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const conversationId = req.params.id;
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return next(new ErrorHandler("No such conversation", 400));
        }

        const user1 = await Users.findOne({ _id: userId });

        if (!user1) {
            return next(new ErrorHandler("No such user", 404));
        }

        const receiverId = conversation.participants.find((participant) => participant.toString() !== userId.toString());

        const user2 = await Users.findOne({ _id: receiverId });

        if (!user2) {
            return next(new ErrorHandler("No such user", 404));
        }

        // Soft delete conversation for the user
        await Conversation.updateOne({ _id: conversationId, deletedBy: { $ne: userId } }, { $addToSet: { deletedBy: userId } });
        if (user1.pinnedConversation?.toString() === conversationId.toString()) {
            user1.pinnedConversation = null;
            user1.save();
        }
        if (user2.pinnedConversation?.toString() === conversationId.toString()) {
            user2.pinnedConversation = null;
            user2.save();
        }

        if (conversation.deletedBy.length + 1 === 2) {
            await conversation.deleteOne({ _id: conversationId });
            await Message.deleteMany({ conversation: conversationId });

            if (user1.pinnedConversation?.toString() === conversationId.toString()) {
                user1.pinnedConversation = null;
                user1.save();
            }
            if (user2.pinnedConversation?.toString() === conversationId.toString()) {
                user2.pinnedConversation = null;
                user2.save();
            }
        }

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.getAllConversationsOfTheLoggedInUser = async (req, res, next) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user._id] },
            deletedBy: { $ne: req.user._id },
        });
        return res.status(200).json({
            success: true,
            conversations: conversations,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
