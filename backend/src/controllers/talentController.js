require("dotenv").config();
const fs = require("fs");
const privateDataModel = require("../models/privateDataModel");
const userModel = require("../models/userModel");
const talentModel = require("../models/talentModel");
const entertainmentCategoriesModel = require("../models/entertainmentCategoriesModel");
const snap = require("../middleware/midtransClient");
const { uploadTalent } = require("../middleware/uploadImage");

const talentController = {
    async createTalent(req, res) {
        try {
            const { nik_ktp } = req.body;

            const nikExists = await talentModel.findOne({ nik_ktp });
            if (nikExists) {
                return res.status(400).json({
                    success: false,
                    message: "NIK KTP already exists",
                });
            }

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

            await talentModel.create({
                _id: req.user._id,
                nik_ktp,
            });

            user.roles = [...new Set([...user.roles, "talent"])];
            user.upgrade = payment.token;
            user.updatedAt = new Date();

            await user.save();

            return res.status(201).json({
                success: true,
                message: "Talent created successfully",
                data: {
                    token: payment.token,
                    redirect_url: payment.redirect_url,
                },
            });
        } catch (error) {
            console.error("Error creating talent", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async talentProfile(req, res) {
        try {
            const talent = await talentModel.findById(req.user._id, {
                biography: 1,
                location: 1,
                entertainment_id: 1,
                isOpen: 1,
            });

            if (!talent) {
                return res.status(404).json({
                    success: false,
                    message: "Talent not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Talent profile",
                data: talent,
            });
        } catch (error) {
            console.error("Error getting talent profile", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    },

    async updateTalentProfile(req, res) {
        try {
            const { biography, location, entertainment_id, isOpen } = req.body;

            const talent = await talentModel.findById(req.user._id);
            if (!talent) {
                return res.status(404).json({
                    success: false,
                    message: "Talent not found",
                });
            }

            const entertainmentCategory = await entertainmentCategoriesModel.findById(entertainment_id);
            if (!entertainmentCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Entertainment ID",
                });
            }

            talent.biography = biography;
            talent.location = location;
            talent.entertainment_id = entertainment_id;
            talent.isOpen = isOpen;
            talent.updatedAt = new Date();

            await talent.save();

            return res.status(200).json({
                success: true,
                message: "Talent updated successfully",
            });
        } catch (error) {
            console.error("Error updating talent", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async uploadTalentImage(req, res) {
        try {
            uploadTalent(req, res, async (err) => {
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

                const talent = await talentModel.findById(req.user.id);
                if (!talent) {
                    return res.status(404).json({
                        success: false,
                        message: "Talent not found",
                    });
                }

                const imageUrl = `${process.env.BASE_URL}talent/${talent.id}/image/${req.file.filename}`;

                talent.images.push(imageUrl);
                talent.updatedAt = new Date();

                await talent.save();

                return res.status(200).json({
                    success: true,
                    message: "Image uploaded successfully",
                });
            });
        } catch (error) {
            console.error("Error uploading image", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async talentAllImages(req, res) {
        try {
            const { id } = req.params;
            const talent = await talentModel.findById(id);

            if (!talent) {
                return res.status(404).json({
                    success: false,
                    message: "Talent not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Talent images",
                data: talent.images,
            });
        } catch (error) {
            console.error("Error getting talent images", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async talentImage(req, res) {
        try {
            const { id, filename } = req.params;
            const path = `/app/users/${id}/talent/${filename}`;

            if (fs.existsSync(path)) {
                return res.status(200).sendFile(path);
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Image not found",
                });
            }
        } catch (error) {
            console.error("Error getting talent image", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
};


module.exports = talentController;
