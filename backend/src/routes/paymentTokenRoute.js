const express = require("express");
const router = express.Router();

const paymentTokenController = require("../controllers/paymentTokenController");
const checkAuth = require("../middleware/checkAuth");

router.get("/token", checkAuth, paymentTokenController.createPaymentToken);


module.exports = router;
