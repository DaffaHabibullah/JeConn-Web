const mongoose = require("mongoose");

const vacanciesSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    imageProfile: {
        type: String,
        required: true,
    },
    typePost: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    candidates: {
        type: String,
        required: true,
    },
    allCandidates: {
        type: Array,
    },
    salary: {
        type: String,
        required: true,
    },
    typeSalary: {
        type: String,
        enum: ["hour", "day"],
        required: true,
    },
    entertainment_id: {
        type: Array,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("Vacancies", vacanciesSchema);
