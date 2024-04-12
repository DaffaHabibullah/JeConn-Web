require("dotenv").config();
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    gender: {
        type: Boolean,
    },
    location: {
        type: String,
    },
    imageProfile: {
        type: String,
        default: process.env.BASE_URL + "public/images/default_image.jpg",
    },
    roles: {
        type: [String],
        enum: ["user", "talent"],
        default: "user",
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
    entertainment_id: {
        type: Array,
    },
    massageRoom_id: {
        type: Array,
    },
    updated_at: {
        type: String,
        default: new Date().toISOString(),
    },
});


module.exports = mongoose.model("User", userSchema);
