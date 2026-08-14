const Notification = require("../models/notification.model");

const createNotification = async ({
    user,
    title,
    message,
    type,
    relatedOrder,
}) => {

    const notification = await Notification.create({
        user,
        title,
        message,
        type,
        relatedOrder,
        isRead: false,
    });

    return notification;
};

module.exports = createNotification;