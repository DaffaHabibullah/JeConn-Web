const mongoose = require("mongoose");

const talentSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    nik_ktp: {
        type: String,
        required: true,
    },
    biography: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    entertainment_id: {
        type: Array,
        required: true,
    },
    isOpen: {
        type: Boolean,
        required: true,
        default: true,
    },
    images: {
        type: Array,
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


module.exports = mongoose.model("Talent", talentSchema);
