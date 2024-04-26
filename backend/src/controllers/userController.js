require("dotenv").config();
const fs = require("fs");
const { uploadProfile } = require("../middleware/uploadImage");

const userController = {
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

                return res.status(200).json({
                    success: true,
                    message: "Profile image uploaded successfully",
                    data: {
                        imageUrl,
                    },
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
};


module.exports = userController;
