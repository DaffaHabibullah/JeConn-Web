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

    async createIndonesiaProvince(req, res) {
        try {
            const { name } = req.body;

            if (req.role !== "admin") {
                return res.status(403).json({
                    success: "false",
                    message: "Unauthorized to create Indonesia province",
                });
            }

            const totalProvinces = await indonesiaProvinceModel.countDocuments();
            const newId = totalProvinces + 1;

            await indonesiaProvinceModel.create({
                _id: newId,
                name,
            });

            return res.status(201).json({
                success: "true",
                message: "Indonesia province created successfully",
            });
        } catch (error) {
            console.error("Error creating Indonesia province", error);
            return res.status(500).json({
                success: "false",
                message: "Error creating Indonesia province",
                error: error.message,
            });
        }
    },

    async updateIndonesiaProvince(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const indonesiaProvince = await indonesiaProvinceModel.findByIdAndUpdate(id, {
                name,
            });

            if (!indonesiaProvince) {
                return res.status(404).json({
                    success: "false",
                    message: "Indonesia province not found",
                });
            }

            if (req.role !== "admin") {
                return res.status(403).json({
                    success: "false",
                    message: "Unauthorized to update Indonesia province",
                });
            }

            return res.status(200).json({
                success: "true",
                message: "Indonesia province updated successfully",
            });
        } catch (error) {
            console.error("Error updating Indonesia province", error);
            return res.status(500).json({
                success: "false",
                message: "Error updating Indonesia province",
                error: error.message,
            });
        }
    },

    async deleteIndonesiaProvince(req, res) {
        try {
            const { id } = req.params;
            const indonesiaProvince = await indonesiaProvinceModel.findByIdAndDelete(id);

            if (!indonesiaProvince) {
                return res.status(404).json({
                    success: "false",
                    message: "Indonesia province not found",
                });
            }

            if (req.role !== "admin") {
                return res.status(403).json({
                    success: "false",
                    message: "Unauthorized to delete Indonesia province",
                });
            }

            return res.status(200).json({
                success: "true",
                message: "Indonesia province deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting Indonesia province", error);
            return res.status(500).json({
                success: "false",
                message: "Error deleting Indonesia province",
                error: error.message,
            });
        }
    },
};


module.exports = indonesiaProvinceController;
