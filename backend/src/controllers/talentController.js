const talentModel = require("../models/talentModel");
const userModel = require("../models/userModel");
const entertainmentCategoriesModel = require("../models/entertainmentCategoriesModel");

const talentController = {
    async createTalent(req, res) {
        try {
            const { nik_ktp, biography, location, entertainment_id } = req.body;

            const nikExists = await talentModel.findOne({ nik_ktp });
            if (nikExists) {
                return res.status(400).json({
                    success: false,
                    message: "NIK KTP already exists",
                });
            }

            const entertainmentCategory = await entertainmentCategoriesModel.findById(entertainment_id);
            if (!entertainmentCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Entertainment ID",
                });
            }

            await talentModel.create({
                _id: req.user._id,
                nik_ktp,
                biography,
                location,
                entertainment_id,
            });

            const user = await userModel.findById(req.user._id);
            user.roles = user.roles.concat("talent");

            await user.save();

            return res.status(201).json({
                success: true,
                message: "Talent created successfully",
            });
        } catch (error) {
            console.error("Error getting user profile", error);
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
};


module.exports = talentController;
