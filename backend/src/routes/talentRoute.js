const express = require("express");
const router = express.Router();

const talentController = require("../controllers/talentController");
const checkAuth = require("../middleware/checkAuth");

router.get("/all-talents", checkAuth, talentController.allTalents);
router.post("/register", checkAuth, talentController.createTalent);
router.get("/profile", checkAuth, talentController.talentProfile);
router.put("/update-profile", checkAuth, talentController.updateTalentProfile);
router.post("/upload-image-profile", checkAuth, talentController.uploadTalentImage);
router.get("/:id/images", talentController.talentAllImages);
router.get("/:id/image/:filename", talentController.talentImage);
router.delete("/delete-image/image/:filename", checkAuth, talentController.deleteTalentImage);
router.get("/getAll", talentController.getAllTalent);
router.get("/get/:username", talentController.getTalentByUsername);


module.exports = router;
