require("dotenv").config();
const fs = require("fs");
const privateDataModel = require("../models/privateDataModel");
const userModel = require("../models/userModel");
const vacanciesModel = require("../models/vacanciesModel");
const messageRoomsModel = require("../models/messageRoomsModel");
const { uploadProfile } = require("../middleware/uploadImage");

const userController = {
    async allUsers(req, res) {
        try {
            if (req.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const privateData = await privateDataModel.find();
            const users = await userModel.find();

            const allUsers = privateData.map((data) => {
                const user = users.find((user) => user.username === data.username);
                return {
                    _id: data._id,
                    username: data.username,
                    email: data.email,
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    dateOfBirth: user.dateOfBirth,
                    gender: user.gender,
                    address: user.address,
                    roles: user.roles,
                    vacanciesId: user.vacanciesId,
                    messageRoom_id: user.messageRoom_id,
                    imageProfile: user.imageProfile,
                    status: data.status,
                    updatedAt: user.updatedAt,
                    createdAt: data.createdAt,
                };
            });

            return res.status(200).json({
                success: true,
                message: "All users",
                data: allUsers,
            });
        } catch (error) {
            console.error("Error getting all users", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async userProfile(req, res) {
        try {
            const user = req.user;
            return res.status(200).json({
                success: true,
                message: "User profile",
                data: {
                    username: user.username,
                    imageProfile: user.imageProfile,
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    dateOfBirth: user.dateOfBirth,
                    gender: user.gender,
                    address: user.address,
                    roles: user.roles,
                    vacanciesId: user.vacanciesId,
                    messageRoom_id: user.messageRoom_id,
                },
            });
        } catch (error) {
            console.error("Error getting user profile", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async updateUserProfile(req, res) {
        try {
            const user = req.user;
            const { fullName, dateOfBirth, gender, address, phoneNumber } = req.body;

            user.fullName = fullName;
            user.dateOfBirth = dateOfBirth;
            user.gender = gender;
            user.address = address;
            user.phoneNumber = phoneNumber;
            user.updatedAt = new Date();

            await user.save();

            return res.status(200).json({
                success: true,
                message: "User profile updated successfully",
            });
        } catch (error) {
            console.error("Error updating user profile", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async uploadProfileImage(req, res) {
        try {
            uploadProfile(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message,
                    });
                }

                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        message: "No file uploaded",
                    });
                }

                const user = req.user;
                const imageUrl = `${process.env.BASE_URL}user/${user.id}/profile/${req.file.filename}`;

                user.imageProfile = imageUrl;
                user.updatedAt = new Date();
                await user.save();

                await vacanciesModel.updateMany(
                    { _id: { $in: user.vacanciesId } },
                    { imageProfile: imageUrl },
                );

                await vacanciesModel.updateMany(
                    { "allCandidates.username": user.username },
                    { $set: { "allCandidates.$[elem].imageProfile": imageUrl } },
                    { arrayFilters: [{ "elem.username": user.username }] },
                );

                await messageRoomsModel.updateMany(
                    { "members.username": user.username },
                    {
                        $set: {
                            "members.$.imageProfile": imageUrl,
                            "messages.$[elem].imageProfile": imageUrl,
                        },
                    },
                    { arrayFilters: [{ "elem.username": user.username }] },
                );

                return res.status(200).json({
                    success: true,
                    message: "Profile image uploaded successfully",
                });
            });
        } catch (error) {
            console.error("Error uploading profile image", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async profileImage(req, res) {
        try {
            const { id, filename } = req.params;
            const path = `/app/users/${id}/profile/${filename}`;

            if (fs.existsSync(path)) {
                return res.status(200).sendFile(path);
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Image not found",
                });
            }
        } catch (error) {
            console.error("Error getting profile image", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async bannedUser(req, res) {
        try {
            if (req.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const { id } = req.params;
            const user = await privateDataModel.findById(id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            user.status = false;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "User banned successfully",
            });
        } catch (error) {
            console.error("Error banning user", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async unbanUser(req, res) {
        try {
            if (req.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const { id } = req.params;
            const user = await privateDataModel.findById(id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            user.status = true;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "User unbanned successfully",
            });
        } catch (error) {
            console.error("Error unbanning user", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
};


module.exports = userController;
