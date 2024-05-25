const userModel = require("../models/userModel");
const vacanciesModel = require("../models/vacanciesModel");
const indonesiaProvinceModel = require("../models/indonesiaProvinceModel");
const entertainmentCategoriesModel = require("../models/entertainmentCategoriesModel");
const generateId = require("../utils/generateId");

const vacanciesController = {
    async createVacancies(req, res) {
        try {
            const {
                typePost, title, location, startDate, endDate, address, description,
                candidates, salary, typeSalary, entertainment_id
            } = req.body;

            const user = await userModel.findById(req.user._id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const indonesiaProvince = await indonesiaProvinceModel.findById(location);
            if (!indonesiaProvince) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Location ID",
                });
            }

            const entertainmentCategory = await entertainmentCategoriesModel.findById(entertainment_id);
            if (!entertainmentCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Entertainment ID",
                });
            }

            const vacancies = await vacanciesModel.create({
                _id: generateId(),
                username: user.username,
                imageProfile: user.imageProfile,
                typePost,
                title,
                location: indonesiaProvince.name,
                startDate,
                endDate,
                address,
                description,
                candidates,
                salary,
                typeSalary,
                entertainment_id,
            });

            user.vacanciesId.push(vacancies._id);
            await user.save();

            return res.status(201).json({
                success: true,
                message: "Vacancies created successfully",
            });
        } catch (error) {
            console.error("Error creating vacancies", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async getVacancies(req, res) {
        try {
            const vacancies = await vacanciesModel.find();

            return res.status(200).json({
                success: true,
                message: "All vacancies",
                data: vacancies,
            });
        } catch (error) {
            console.error("Error getting vacancies", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async getVacanciesById(req, res) {
        try {
            const vacancies = await vacanciesModel.findById(req.params.id);
            if (!vacancies) {
                return res.status(404).json({
                    success: false,
                    message: "Vacancies not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Vacancies",
                data: vacancies,
            });
        } catch (error) {
            console.error("Error getting vacancies", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async updateVacancies(req, res) {
        try {
            const {
                title, startDate, endDate, address, description, candidates, salary, typeSalary, entertainment_id
            } = req.body;

            const vacancies = await vacanciesModel.findById(req.params.id);
            if (!vacancies) {
                return res.status(404).json({
                    success: false,
                    message: "Vacancies not found",
                });
            }

            if (vacancies.username !== req.user.username) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const entertainmentCategory = await entertainmentCategoriesModel.findById(entertainment_id);
            if (!entertainmentCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Entertainment ID",
                });
            }

            await vacanciesModel.findByIdAndUpdate(req.params.id, {
                title,
                startDate,
                endDate,
                address,
                description,
                candidates,
                salary,
                typeSalary,
                entertainment_id,
                updatedAt: new Date(),
            });

            return res.status(200).json({
                success: true,
                message: "Vacancies updated successfully",
            });
        } catch (error) {
            console.error("Error updating vacancies", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async deleteVacancies(req, res) {
        try {
            const vacancies = await vacanciesModel.findById(req.params.id);
            if (!vacancies) {
                return res.status(404).json({
                    success: false,
                    message: "Vacancies not found",
                });
            }

            if (vacancies.username !== req.user.username) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            await vacanciesModel.findByIdAndDelete(req.params.id);

            return res.status(200).json({
                success: true,
                message: "Vacancies deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting vacancies", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
};


module.exports = vacanciesController;
