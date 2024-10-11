const entertainmentCategoriesModel = require("../models/entertainmentCategoriesModel");
const counterModel = require("../models/counterId");

const entertainmentController = {
    async getEntertainmentCategories(req, res) {
        try {
            const entertainmentCategories = await entertainmentCategoriesModel.find({}, {
                id: 1,
                name: 1,
            });

            return res.status(200).json({
                success: "true",
                message: "Entertainment categories retrieved successfully",
                data: entertainmentCategories,
            });
        } catch (error) {
            console.error("Error retrieving entertainment categories", error);
            return res.status(500).json({
                success: "false",
                message: "Error retrieving entertainment categories",
                error: error.message,
            });
        }
    },

    async getByIdEntertainmentCategories(req, res) {
        try {
            const { id } = req.params;
            const entertainmentCategories = await entertainmentCategoriesModel.findById(id, {
                id: 1,
                name: 1,
            });

            if (!entertainmentCategories) {
                return res.status(404).json({
                    success: "false",
                    message: "Entertainment categories not found",
                });
            }

            return res.status(200).json({
                success: "true",
                message: "Entertainment categories retrieved successfully",
                data: entertainmentCategories,
            });
        } catch (error) {
            console.error("Error retrieving entertainment categories", error);
            return res.status(500).json({
                success: "false",
                message: "Error retrieving entertainment categories",
                error: error.message,
            });
        }
    },

    async createEntertainmentCategories(req, res) {
        try {
            const { name } = req.body;

            if (req.role !== "admin") {
                return res.status(403).json({
                    success: "false",
                    message: "Unauthorized to create entertainment categories",
                });
            }

            const counter = await counterModel.findByIdAndUpdate(
                { _id: "categoryId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const newId = counter.seq;

            await entertainmentCategoriesModel.create({
                _id: newId,
                name,
            });

            return res.status(201).json({
                success: "true",
                message: "Entertainment categories created successfully",
            });
        } catch (error) {
            console.error("Error creating entertainment categories", error);
            return res.status(500).json({
                success: "false",
                message: "Error creating entertainment categories",
                error: error.message,
            });
        }
    },

    async updateEntertainmentCategories(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const entertainmentCategories = await entertainmentCategoriesModel.findByIdAndUpdate(id, {
                name,
            });

            if (!entertainmentCategories) {
                return res.status(404).json({
                    success: "false",
                    message: "Entertainment categories not found",
                });
            }

            if (req.role !== "admin") {
                return res.status(403).json({
                    success: "false",
                    message: "Unauthorized to update entertainment categories",
                });
            }

            return res.status(200).json({
                success: "true",
                message: "Entertainment categories updated successfully",
            });
        } catch (error) {
            console.error("Error updating entertainment categories", error);
            return res.status(500).json({
                success: "false",
                message: "Error updating entertainment categories",
                error: error.message,
            });
        }
    },

    async deleteEntertainmentCategories(req, res) {
        try {
            const { id } = req.params;
            const entertainmentCategories = await entertainmentCategoriesModel.findByIdAndDelete(id);

            if (!entertainmentCategories) {
                return res.status(404).json({
                    success: "false",
                    message: "Entertainment categories not found",
                });
            }

            if (req.role !== "admin") {
                return res.status(403).json({
                    success: "false",
                    message: "Unauthorized to delete entertainment categories",
                });
            }

            return res.status(200).json({
                success: "true",
                message: "Entertainment categories deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting entertainment categories", error);
            return res.status(500).json({
                success: "false",
                message: "Error deleting entertainment categories",
                error: error.message,
            });
        }
    },
};


module.exports = entertainmentController;
