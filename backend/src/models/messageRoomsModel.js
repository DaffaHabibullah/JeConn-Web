const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    imageProfile: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const messageRoomsSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    members: {
        type: Array,
        required: true,
    },
    messages: {
        type: [messageSchema],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("MessageRooms", messageRoomsSchema);
