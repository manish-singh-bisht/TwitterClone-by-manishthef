const Conversation = require("../../models/chat/conversationModel");
const Message = require("../../models/chat/messageModel");
const Users = require("../../models/userModel");
const ErrorHandler = require("../../utils/ErrorHandler");

async function pagination(model, options = {}, req) {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments())) {
        results.next = {
            page: page + 1,
            limit: limit,
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit,
        };
    }

    const query = model
        .find(options.query || {})
        .limit(limit)
        .skip(startIndex)
        .sort(options.sort || {});

    if (options.populate) {
        query.populate(options.populate);
    }

    results.data = await query;

    return results;
}

exports.createConversation = async (req, res, next) => {
    try {
        const { senderId, receiverId } = req.body;

        if (!receiverId || !senderId || receiverId === senderId) {
            return next(new ErrorHandler("Invalid participants", 500));
        }
        const existingConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (existingConversation) {
            existingConversation.deletedBy.splice(0, existingConversation.deletedBy.length);
            await existingConversation.save();

            const conversation = await Conversation.findById(existingConversation._id)
                .populate({
                    path: "participants",
                    select: "name handle profile _id createdAt followersCount",
                    match: { _id: { $ne: req.user._id } },
                })
                .populate({
                    path: "latest.message",
                    select: "content createdAt",
                });

            if (conversation.latest[0]?.userId.toString() === req.user._id.toString()) {
                conversation.latest?.splice(0, 1);
            } else {
                conversation.latest?.splice(1, 1);
            }

            await conversation.save();
            return res.status(201).json({
                success: true,
                conversation,
            });
        } else {
            const newConversation = await Conversation.create({ participants: [senderId, receiverId] });

            const conversation = await Conversation.findById(newConversation._id)
                .populate({
                    path: "participants",
                    select: "name handle profile _id createdAt followersCount",
                    match: { _id: { $ne: req.user._id } },
                })
                .populate({
                    path: "latest.message",
                    select: "content createdAt",
                });

            if (conversation.latest[0]?.userId.toString() === req.user._id.toString()) {
                conversation.latest?.splice(1, 1);
            } else {
                conversation.latest?.splice(0, 1);
            }

            await conversation.save();

            return res.status(201).json({
                success: true,
                conversation,
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

        //this message update line below,makes sure that whenever the conversation comes back to the user after soft deleting it,it only shows the messages from there on,not the ones that were before soft deleting the conversation.
        await Message.updateMany({ conversation: conversationId, deletedBy: { $ne: userId } }, { $addToSet: { deletedBy: userId } });

        await Message.deleteMany({ conversation: conversationId, deletedBy: { $all: [userId, receiverId] } });

        if (user1.pinnedConversation?.toString() === conversationId.toString()) {
            user1.pinnedConversation = null;
            user1.save();
        }
        if (user2.pinnedConversation?.toString() === conversationId.toString()) {
            user2.pinnedConversation = null;
            user2.save();
        }

        if (conversation.deletedBy.length + 1 === 2) {
            await Conversation.deleteOne({ _id: conversationId });
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
        const conversations = await pagination(
            Conversation,
            {
                query: {
                    participants: { $in: [req.user._id] },
                    deletedBy: { $ne: req.user._id },
                },
                populate: [
                    { path: "participants", select: "name handle profile _id createdAt followersCount", match: { _id: { $ne: req.user._id } } },

                    {
                        path: "latest",
                        populate: { path: "message", select: "content createdAt" },
                    },
                ],
            },
            req
        );

        const filteredConversations = conversations.data.map((conversation) => {
            if (conversation.latest[0]?.userId.toString() === req.user._id.toString()) {
                conversation.latest.splice(1, 1);
            } else {
                conversation.latest?.splice(0, 1);
            }
            return conversation;
        });

        return res.status(200).json({
            success: true,
            conversations: filteredConversations,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
