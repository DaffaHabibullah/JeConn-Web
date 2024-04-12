const mongoose = require("mongoose");

const privateDataSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    created_at: {
        type: String,
        default: new Date().toISOString(),
    },
});


module.exports = mongoose.model("PrivateData", privateDataSchema);
