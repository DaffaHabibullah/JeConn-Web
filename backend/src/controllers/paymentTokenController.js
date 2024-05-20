const privateDataModel = require("../models/privateDataModel");
const userModel = require("../models/userModel");
const snap = require("../middleware/midtransConfig");

const paymentTokenController = {
    async createPaymentToken(req, res) {
        try {
            const user = await userModel.findById(req.user._id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const privateData = await privateDataModel.findById(user._id);
            if (!privateData) {
                return res.status(404).json({
                    success: false,
                    message: "Private data not found",
                });
            }

            const transactionDetails = {
                "transaction_details": {
                    "order_id": `${user._id}-${new Date().getTime()}`,
                    "gross_amount": 10000,
                },
                "credit_card": {
                    "secure": true,
                },
                "customer_details": {
                    "first_name": user.fullName,
                    "email": privateData.email,
                    "phone": user.phoneNumber,
                },
            };

            const payment = await snap.createTransaction(transactionDetails);
            if (!payment.token) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to create payment",
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    token: payment.token,
                },
            });
        } catch (error) {
            console.error("Failed to create payment token:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to create payment token",
            });
        }
    },
};


module.exports = paymentTokenController;
