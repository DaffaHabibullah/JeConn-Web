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
        default: "https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg",
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
