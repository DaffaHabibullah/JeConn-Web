const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");

router.get("/all-users", checkAuth, userController.allUsers);
router.get("/profile", checkAuth, userController.userProfile);
router.post("/update-profile", checkAuth, userController.updateUserProfile);
router.post("/update-image-profile", checkAuth, userController.uploadProfileImage);
router.get("/:id/profile/:filename", userController.profileImage);
router.put("/ban-user/:id", checkAuth, userController.bannedUser);
router.put("/unban-user/:id", checkAuth, userController.unbanUser);


module.exports = router;
