require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");

const checkAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, token missing",
            });
        }

        const token = authorization.replace("Bearer ", "");

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            let checkRole = null;

            if (decoded.userId) {
                checkRole = await userModel.findOne({ _id: decoded.userId });
                if (!checkRole) {
                    return res.status(401).json({
                        success: false,
                        message: "Unauthorized, user not found",
                    });
                }
                req.user = checkRole;
                req.role = "user";
            } else if (decoded.adminId) {
                checkRole = await adminModel.findOne({ _id: decoded.adminId });
                if (!checkRole) {
                    return res.status(401).json({
                        success: false,
                        message: "Unauthorized, admin not found",
                    });
                }
                req.admin = checkRole;
                req.role = "admin";
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized, invalid token",
                });
            }

            next();
        } catch (error) {
            console.error("Error verifying token", error);
            return res.status(401).json({
                success: false,
                message: "Unauthorized, token verification failed",
            });
        }
    } catch (error) {
        console.error("Error in authorization process", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


module.exports = checkAuth;
