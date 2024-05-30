require("dotenv").config();
const fs = require("fs");
const userModel = require("../models/userModel");
const talentModel = require("../models/talentModel");
const indonesiaProvinceModel = require("../models/indonesiaProvinceModel");
const entertainmentCategoriesModel = require("../models/entertainmentCategoriesModel");
const { uploadTalent } = require("../middleware/uploadImage");

const talentController = {
    async createTalent(req, res) {
        try {
            const { nikKTP, firstName, lastName, phoneNumber, address, provinceId, postalCode } = req.body;

            const nikExists = await talentModel.findOne({ nikKTP });
            if (nikExists) {
                return res.status(400).json({
                    success: false,
                    message: "NIK KTP already exists",
                });
            }

            const indonesiaProvince = await indonesiaProvinceModel.findById(provinceId);
            if (!indonesiaProvince) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Province ID",
                });
            }

            await talentModel.create({
                _id: req.user._id,
                nikKTP,
                firstName,
                lastName,
                phoneNumber,
                address,
                province: indonesiaProvince.name,
                postalCode,
            });

            const user = await userModel.findById(req.user._id);

            user.roles = [...new Set([...user.roles, "talent"])];
            user.updatedAt = new Date();

            await user.save();

            return res.status(201).json({
                success: true,
                message: "Talent created successfully",
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

    async deleteTalentImage(req, res) {
        try {
            const { filename } = req.params;
            const talent = await talentModel.findById(req.user.id);

            if (!talent) {
                return res.status(404).json({
                    success: false,
                    message: "Talent not found",
                });
            }

            const imageIndex = talent.images.findIndex(image => image.includes(filename));
            if (imageIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: "Image not found",
                });
            }

            const filePath = `/app/users/${req.user.id}/talent/${filename}`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            talent.images.splice(imageIndex, 1);
            talent.updatedAt = new Date();

            await talent.save();

            return res.status(200).json({
                success: true,
                message: "Image deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting talent image", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async getAllTalent(req, res) {
        try {
            const talents = await talentModel.find();
            const entertainmentCategories = await entertainmentCategoriesModel.find();
            const entertainmentMap = entertainmentCategories.reduce((map, category) => {
                map[category._id] = category.name;
                return map;
            }, {});

            const result = await Promise.all(
                talents.map(async (talent) => {
                    const user = await userModel.findById(talent._id);
                    return {
                        biography: talent.biography,
                        location: talent.location,
                        entertainment_id: talent.entertainment_id.map((id) => entertainmentMap[id] || id),
                        isOpen: talent.isOpen,
                        images: talent.images,
                        createdAt: talent.createdAt,
                        username: user.username,
                        fullName: user.fullName,
                        imageProfile: user.imageProfile,
                    };
                }),
            );

            return res.status(200).json({
                success: true,
                message: "All talent",
                data: result,
            });
        } catch (error) {
            console.error("Error getting talent", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async getTalentByUsername(req, res) {
        try {
            const user = await userModel.findOne({ username: req.params.username });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const talent = await talentModel.findById(user._id);
            if (!talent) {
                return res.status(404).json({
                    success: false,
                    message: "Talent not found",
                });
            }

            const entertainmentCategories = await entertainmentCategoriesModel.find({
                _id: { $in: talent.entertainment_id },
            });

            const entertainmentNames = entertainmentCategories.map((category) => category.name);

            return res.status(200).json({
                success: true,
                message: "Talent",
                data: {
                    biography: talent.biography,
                    location: talent.location,
                    entertainment_id: entertainmentNames,
                    isOpen: talent.isOpen,
                    images: talent.images,
                    username: user.username,
                    fullName: user.fullName,
                    imageProfile: user.imageProfile,
                },
            });
        } catch (error) {
            console.error("Error getting talent", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
};


module.exports = talentController;
