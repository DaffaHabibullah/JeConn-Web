const express = require("express");
const router = express.Router();

const indonesiaProvinceController = require("../controllers/indonesiaProvinceController");

router.get("/", indonesiaProvinceController.getIndonesiaProvinces);
router.get("/:id", indonesiaProvinceController.getByIdIndonesiaProvince);


module.exports = router;
