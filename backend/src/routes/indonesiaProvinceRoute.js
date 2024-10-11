const express = require("express");
const router = express.Router();

const indonesiaProvinceController = require("../controllers/indonesiaProvinceController");
const checkAuth = require("../middleware/checkAuth");

router.get("/", indonesiaProvinceController.getIndonesiaProvinces);
router.get("/:id", indonesiaProvinceController.getByIdIndonesiaProvince);
router.post("/add", checkAuth, indonesiaProvinceController.createIndonesiaProvince);
router.put("/update/province/:id", checkAuth, indonesiaProvinceController.updateIndonesiaProvince);
router.delete("/delete/province/:id", checkAuth, indonesiaProvinceController.deleteIndonesiaProvince);


module.exports = router;
