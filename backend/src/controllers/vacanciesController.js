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
                candidates, salary, typeSalary, entertainment_id,
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
                title, startDate, endDate, address, description,
                candidates, salary, typeSalary, entertainment_id, status,
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
                status,
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

            await userModel.updateOne(
                { _id: req.user._id },
                { $pull: { vacanciesId: req.params.id } },
            );
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

    async submitVacancies(req, res) {
        try {
            const { id } = req.params;
            const user = await userModel.findById(req.user._id);

            const vacancies = await vacanciesModel.findById(id);
            if (!vacancies) {
                return res.status(404).json({
                    success: false,
                    message: "Vacancies not found",
                });
            }

            if (vacancies.username === user.username) {
                return res.status(400).json({
                    success: false,
                    message: "You can't submit your own vacancies",
                });
            }

            if (vacancies.allCandidates.find((candidate) => candidate._id.toString() === user._id.toString())) {
                return res.status(400).json({
                    success: false,
                    message: "You already submitted to this vacancies",
                });
            }

            vacancies.allCandidates.push({
                _id: user._id,
                username: user.username,
                imageProfile: user.imageProfile,
            });

            await vacancies.save();

            return res.status(200).json({
                success: true,
                message: "Submitted to vacancies successfully",
            });
        } catch (error) {
            console.error("Error submitted vacancies", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async submittedVacancies(req, res) {
        try {
            const user = await userModel.findById(req.user._id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const vacancies = await vacanciesModel.find({ allCandidates: { $elemMatch: { username: user.username } } });

            return res.status(200).json({
                success: true,
                message: "Submitted vacancies",
                data: vacancies,
            });
        } catch (error) {
            console.error("Error getting submitted vacancies", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async updateStatusCandidate(req, res) {
        try {
            const { id, username } = req.params;
            const { status } = req.body;

            const vacancies = await vacanciesModel.findById(id);
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

            const candidate = vacancies.allCandidates.find((candidate) => candidate.username === username);
            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    message: "Candidate not found",
                });
            }

            candidate.status = status;
            candidate.updatedAt = new Date();
            await vacancies.save();

            return res.status(200).json({
                success: true,
                message: "Candidate status updated successfully",
            });
        } catch (error) {
            console.error("Error updating candidate status", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
};


module.exports = vacanciesController;
