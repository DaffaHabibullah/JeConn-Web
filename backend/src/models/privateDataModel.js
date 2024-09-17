const mongoose = require("mongoose");

const privateDataSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    id_privateData: {
        type: String,
        default: function() {
            return this._id;
        },
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("PrivateData", privateDataSchema);
