const Notification = require('../models/notification.model');


const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");


// ======================================
// GET MY NOTIFICATIONS
// ======================================

const getMyNotifications = asyncHandler(
    async (req, res) => {

        const notifications =
            await Notification.find({
                user: req.user._id,
            })
                .populate(
                    "relatedOrder",
                    "orderId orderStatus totalAmount"
                )
                .sort({
                    createdAt: -1,
                });

        const unreadCount =
            await Notification.countDocuments({
                user: req.user._id,
                isRead: false,
            });

        return res.status(200).json(

            new ApiResponse(

                200,

                "Notifications fetched successfully",

                {
                    notifications,
                    unreadCount,
                }

            )

        );

    }
);


// ======================================
// MARK ONE NOTIFICATION AS READ
// ======================================

const markNotificationAsRead = asyncHandler(
    async (req, res) => {

        const { id } = req.params;

        const notification =
            await Notification.findOne({
                _id: id,
                user: req.user._id,
            });

        if (!notification) {

            throw new ApiError(
                404,
                "Notification not found"
            );

        }

        notification.isRead = true;

        await notification.save();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Notification marked as read",

                notification

            )

        );

    }
);


// ======================================
// MARK ALL AS READ
// ======================================

const markAllNotificationsAsRead =
    asyncHandler(async (req, res) => {

        await Notification.updateMany(

            {
                user: req.user._id,
                isRead: false,
            },

            {
                $set: {
                    isRead: true,
                },
            }

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "All notifications marked as read"

            )

        );

    });


// ======================================
// DELETE NOTIFICATION
// ======================================

const deleteNotification = asyncHandler(
    async (req, res) => {

        const { id } = req.params;

        const notification =
            await Notification.findOne({
                _id: id,
                user: req.user._id,
            });

        if (!notification) {

            throw new ApiError(
                404,
                "Notification not found"
            );

        }

        await notification.deleteOne();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Notification deleted successfully"

            )

        );

    }
);


// ======================================
// DELETE ALL NOTIFICATIONS
// ======================================

const deleteAllNotifications =
    asyncHandler(async (req, res) => {

        await Notification.deleteMany({
            user: req.user._id,
        });

        return res.status(200).json(

            new ApiResponse(

                200,

                "All notifications deleted successfully"

            )

        );

    });


module.exports = {

    getMyNotifications,

    markNotificationAsRead,

    markAllNotificationsAsRead,

    deleteNotification,

    deleteAllNotifications,

};