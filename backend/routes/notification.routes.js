import protectRoute from "../middlewares/protectRoute.js";
import express from "express";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.patch(
	"/:notificationId/read",
	protectRoute,
	markNotificationAsRead
);
router.patch(
	"/read-all",
	protectRoute,
	markAllNotificationsAsRead
);

export default router;