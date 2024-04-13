const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");

router.get("/profile", checkAuth, userController.userProfile);
router.post("/update-profile", checkAuth, userController.updateUserProfile);


module.exports = router;
