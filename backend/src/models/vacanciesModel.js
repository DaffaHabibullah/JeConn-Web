const mongoose = require("mongoose");

const submitVacanciesSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    id_submitVacancies: {
        type: String,
        default: function() {
            return this._id;
        },
    },
    username: {
        type: String,
        required: true,
    },
    imageProfile: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        required: true,
        default: "pending",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const vacanciesSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    id_vacancies: {
        type: String,
        default: function() {
            return this._id;
        },
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
        type: [submitVacanciesSchema],
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
