const express = require("express");
const router = express.Router();

const entertainmentController = require("../controllers/entertainmentController");
const checkAuth = require("../middleware/checkAuth");

router.get("/", entertainmentController.getEntertainmentCategories);
router.get("/:id", entertainmentController.getByIdEntertainmentCategories);
router.post("/add", checkAuth, entertainmentController.createEntertainmentCategories);
router.put("/update/category/:id", checkAuth, entertainmentController.updateEntertainmentCategories);
router.delete("/delete/category/:id", checkAuth, entertainmentController.deleteEntertainmentCategories);


module.exports = router;
