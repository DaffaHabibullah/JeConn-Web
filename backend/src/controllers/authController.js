require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const privateDataModel = require("../models/privateDataModel");
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");
const generateId = require("../utils/generateId");

const authController = {
    async register(req, res) {
        const { username, email, password } = req.body;
        const formattedUsername = username.toLowerCase().replace(/\s/g, "").replace(/\W/g, "");
        const formattedEmail = email.toLowerCase().replace(/\s/g, "");

        try {
            const existingUser = await privateDataModel.findOne({
                $or: [
                    { username: formattedUsername },
                    { email: formattedEmail },
                ],
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Username or email already exists",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userData = await privateDataModel.create({
                _id: generateId(),
                username: formattedUsername,
                email: formattedEmail,
                password: hashedPassword,
            });
            await userModel.create({
                _id: userData._id,
                username: userData.username,
            });

            return res.status(201).json({
                success: true,
                message: "User created successfully",
            });
        } catch (error) {
            console.error("Error registering user", error);
            if (error.name === "MongoError" && error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: "Username or email already exists",
                });
            }
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;
        const formattedEmail = email.toLowerCase().replace(/\s/g, "");

        try {
            const admin = await adminModel.findOne({ email: formattedEmail });

            if (admin) {
                const passwordMatch = password === admin.password;

                if (!passwordMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password",
                    });
                }

                const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET);

                return res.status(200).json({
                    success: true,
                    message: "Admin login successfully",
                    data: { token },
                });
            }

            const user = await privateDataModel.findOne({ email: formattedEmail });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            if (user.status === false) {
                return res.status(403).json({
                    success: false,
                    message: "User is banned",
                });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
                });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

            return res.status(200).json({
                success: true,
                message: "Login successfully",
                data: { token },
            });
        } catch (error) {
            console.error("Error logging in", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
};


module.exports = authController;
