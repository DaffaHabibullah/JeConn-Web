const express = require("express");
const router = express.Router();

const vacanciesController = require("../controllers/vacanciesController");
const checkAuth = require("../middleware/checkAuth");

router.post("/post", checkAuth, vacanciesController.createVacancies);
router.get("/getAll/post", vacanciesController.getVacancies);
router.get("/get/post/:id", vacanciesController.getVacanciesById);
router.put("/update/post/:id", checkAuth, vacanciesController.updateVacancies);
router.delete("/delete/post/:id", checkAuth, vacanciesController.deleteVacancies);
router.post("/submit-candidate/post/:id", checkAuth, vacanciesController.submitVacancies);


module.exports = router;
