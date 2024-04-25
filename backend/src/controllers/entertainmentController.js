const entertainmentCategoriesModel = require("../models/entertainmentCategoriesModel");

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
};


module.exports = entertainmentController;
