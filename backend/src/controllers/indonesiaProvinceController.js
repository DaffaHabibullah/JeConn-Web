const indonesiaProvinceModel = require("../models/indonesiaProvinceModel");

const indonesiaProvinceController = {
    async getIndonesiaProvinces(req, res) {
        try {
            const indonesiaProvinces = await indonesiaProvinceModel.find({}, {
                _id: 1,
                name: 1,
            });

            return res.status(200).json({
                success: "true",
                message: "Indonesia provinces retrieved successfully",
                data: indonesiaProvinces,
            });
        } catch (error) {
            console.error("Error retrieving Indonesia provinces", error);
            return res.status(500).json({
                success: "false",
                message: "Error retrieving Indonesia provinces",
                error: error.message,
            });
        }
    },

    async getByIdIndonesiaProvince(req, res) {
        try {
            const { id } = req.params;
            const indonesiaProvince = await indonesiaProvinceModel.findById(id, {
                _id: 1,
                name: 1,
            });

            if (!indonesiaProvince) {
                return res.status(404).json({
                    success: "false",
                    message: "Indonesia province not found",
                });
            }

            return res.status(200).json({
                success: "true",
                message: "Indonesia province retrieved successfully",
                data: indonesiaProvince,
            });
        } catch (error) {
            console.error("Error retrieving Indonesia province", error);
            return res.status(500).json({
                success: "false",
                message: "Error retrieving Indonesia province",
                error: error.message,
            });
        }
    },
};


module.exports = indonesiaProvinceController;
