const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
} = require("../controllers/notification.controller");


// Get notifications
router.get(
    "/get",
    authMiddleware,
    getMyNotifications
);


// Mark one as read
router.patch(
    "/:id/read",
    authMiddleware,
    markNotificationAsRead
);


// Mark all as read
router.patch(
    "/read-all",
    authMiddleware,
    markAllNotificationsAsRead
);


// Delete one
router.delete(
    "/delete/:id",
    authMiddleware,
    deleteNotification
);


// Delete all
router.delete(
    "/delete-all",
    authMiddleware,
    deleteAllNotifications
);


module.exports = router;