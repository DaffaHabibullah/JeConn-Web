const mongoose = require("mongoose");

const talentSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    nikKTP: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    postalCode: {
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
