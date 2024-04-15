const express = require("express");
const router = express.Router();

const talentController = require("../controllers/talentController");
const checkAuth = require("../middleware/checkAuth");

router.post("/register", checkAuth, talentController.createTalent);
router.get("/profile", checkAuth, talentController.talentProfile);
router.put("/update-profile", checkAuth, talentController.updateTalentProfile);


module.exports = router;
