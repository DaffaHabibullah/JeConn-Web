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
    },
    location: {
        type: String,
    },
    entertainment_id: {
        type: Array,
    },
    isOpen: {
        type: Boolean,
        required: true,
        default: false,
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
