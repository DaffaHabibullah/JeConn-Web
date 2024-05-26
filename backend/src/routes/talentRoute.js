const express = require("express");
const router = express.Router();

const talentController = require("../controllers/talentController");
const checkAuth = require("../middleware/checkAuth");

router.post("/register", checkAuth, talentController.createTalent);
router.get("/profile", checkAuth, talentController.talentProfile);
router.put("/update-profile", checkAuth, talentController.updateTalentProfile);
router.post("/upload-image-profile", checkAuth, talentController.uploadTalentImage);
router.get("/:id/images", talentController.talentAllImages);
router.get("/:id/image/:filename", talentController.talentImage);
router.get("/getAll", talentController.getAllTalent);
router.get("/get/:id", talentController.getTalentById);


module.exports = router;
