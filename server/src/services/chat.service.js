const Chat=require('../models/chat.model')

const getOrCreateChat = async (userId) => {

    let chat = await Chat.findOne({ user: userId });

    if (!chat) {

        chat = await Chat.create({
            user: userId,
            messages: [],
        });

    }

    return chat;
};

// Save a message
const saveMessage = async (userId, role, content) => {

    const chat = await getOrCreateChat(userId);

    chat.messages.push({
        role,
        content,
    });

    await chat.save();

    return chat;
};

// Last N messages
const getConversationHistory = async (userId, limit = 10) => {

    const chat = await getOrCreateChat(userId);

    return chat.messages.slice(-limit);
};

// Clear chat
const clearConversation = async (userId) => {

    const chat = await getOrCreateChat(userId);

    chat.messages = [];

    await chat.save();

};

module.exports = {

    getOrCreateChat,

    saveMessage,

    getConversationHistory,

    clearConversation,

};