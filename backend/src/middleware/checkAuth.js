require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const checkAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                status: "error",
                message: "You must be logged in",
            });
        }
        const token = authorization.replace("Bearer ", "");

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findOne({ _id: decoded.userId });
            if (!user) {
                throw new Error("User not found");
            }
            req.user = user;
            next();
        } catch (error) {
            throw new Error("Invalid token");
        }
    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: error.message,
        });
    }
};


module.exports = checkAuth;
