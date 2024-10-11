require("dotenv").config();
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    id_admin: {
        type: String,
        default: function() {
            return this._id;
        },
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("Admin", adminSchema);
