const express = require("express");
const router = express.Router();

const entertainmentController = require("../controllers/entertainmentController");

router.get("/", entertainmentController.getEntertainmentCategories);
router.get("/:id", entertainmentController.getByIdEntertainmentCategories);


module.exports = router;
