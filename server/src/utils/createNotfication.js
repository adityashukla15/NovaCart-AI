const Notification = require("../models/notification.model");

const createNotification = async ({
    user,
    title,
    message,
    type = "system",
    relatedOrder = null,
}) => {

    return await Notification.create({

        user,

        title,

        message,

        type,

        relatedOrder,

    });

};

module.exports = createNotification;