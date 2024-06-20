const express = require("express");
const router = express.Router();

const messageRoomsController = require("../controllers/messageRoomsController");
const checkAuth = require("../middleware/checkAuth");

router.post("/create-room", checkAuth, messageRoomsController.createMessageRoom);
router.get("/room/:id", checkAuth, messageRoomsController.allMessagesByRoomId);
router.post("/room/:id/send-message", checkAuth, messageRoomsController.sendMessage);
router.post("/room/:id/send-image", checkAuth, messageRoomsController.sendImageMessage);
router.get("/:id/messages/:filename", messageRoomsController.imageMessage);


module.exports = router;
