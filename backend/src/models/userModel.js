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
        type: String,
    },
    address: {
        type: String,
    },
    phoneNumber: {
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
    messageRoom_id: {
        type: Array,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("User", userSchema);
