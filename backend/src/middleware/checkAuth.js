require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const checkAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const token = authorization.replace("Bearer ", "");

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findOne({ _id: decoded.userId });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            req.user = user;
            next();
        } catch (error) {
            console.error("Error verifying token", error);
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
    } catch (error) {
        console.error("Error updating user profile", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


module.exports = checkAuth;
