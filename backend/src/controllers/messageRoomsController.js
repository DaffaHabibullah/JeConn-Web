require("dotenv").config();
const fs = require("fs");
const userModel = require("../models/userModel");
const messageRoomsModel = require("../models/messageRoomsModel");
const { uploadMessages } = require("../middleware/uploadImage");
const generateId = require("../utils/generateId");

const messageRoomsController = {
    async createMessageRoom(req, res) {
        try {
            const { members } = req.body;

            const member = await userModel.findOne({ username: members });
            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: "Member not found",
                });
            }

            const user = await userModel.findById(req.user._id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            if (user.username === members) {
                return res.status(400).json({
                    success: false,
                    message: "You can't create message room with yourself",
                });
            }

            const existingRoom = await messageRoomsModel.findOne({
                "members.username": { $all: [user.username, members] },
            });

            if (existingRoom) {
                return res.status(200).json({
                    success: true,
                    message: "Message room already exists",
                    data: existingRoom,
                });
            }

            const newMessageRoom = new messageRoomsModel({
                _id: generateId(),
                members: [{
                    username: user.username,
                    imageProfile: user.imageProfile,
                }, {
                    username: member.username,
                    imageProfile: member.imageProfile,
                }],
                messages: [],
            });

            await newMessageRoom.save();

            await userModel.updateOne(
                { username: user.username },
                { $push: { messageRoom_id: newMessageRoom._id } },
            );
            await userModel.updateOne(
                { username: members },
                { $push: { messageRoom_id: newMessageRoom._id } },
            );

            return res.status(201).json({
                success: true,
                message: "Message room created successfully",
                data: newMessageRoom,
            });
        } catch (error) {
            console.error("Error creating message room", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async allMessagesByRoomId(req, res) {
        try {
            const { id } = req.params;
            const messageRoom = await messageRoomsModel.findById(id);

            if (!messageRoom) {
                return res.status(404).json({ message: "Message room not found" });
            }

            return res.status(200).json({
                success: true,
                message: "Messages found",
                data: {
                    members: messageRoom.members,
                    messages: messageRoom.messages,
                },
            });
        } catch (error) {
            console.error("Error getting messages", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async sendMessage(req, res) {
        try {
            const { id } = req.params;
            const { message } = req.body;
            const user = await userModel.findById(req.user._id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const messageRoom = await messageRoomsModel.findById(id);

            if (!messageRoom) {
                return res.status(404).json({ message: "Message room not found" });
            }

            const newMessage = {
                _id: user._id,
                username: user.username,
                imageProfile: user.imageProfile,
                message,
                timestamp: new Date(),
            };

            messageRoom.messages.push(newMessage);
            await messageRoom.save();

            const io = req.app.get("socketio");
            io.to(id).emit("newMessage", newMessage);

            return res.status(200).json({
                success: true,
                message: "Message sent successfully",
            });
        } catch (error) {
            console.error("Error sending message", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async sendImageMessage(req, res) {
        try {
            uploadMessages(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message,
                    });
                }

                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        message: "No file uploaded",
                    });
                }

                const { id } = req.params;
                const user = await userModel.findById(req.user._id);

                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                const messageRoom = await messageRoomsModel.findById(id);

                if (!messageRoom) {
                    return res.status(404).json({ message: "Message room not found" });
                }

                const imageUrl = `${process.env.BASE_URL}message/${user.id}/messages/${req.file.filename}`;

                const newMessage = {
                    _id: user._id,
                    username: user.username,
                    imageProfile: user.imageProfile,
                    message: imageUrl,
                    timestamp: new Date(),
                };

                messageRoom.messages.push(newMessage);
                await messageRoom.save();

                const io = req.app.get("socketio");
                io.to(id).emit("newMessage", newMessage);

                return res.status(200).json({
                    success: true,
                    message: "Message sent successfully",
                });
            });
        } catch (error) {
            console.error("Error sending message", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async imageMessage(req, res) {
        try {
            const { id, filename } = req.params;
            const path = `/app/users/${id}/messages/${filename}`;

            if (fs.existsSync(path)) {
                return res.status(200).sendFile(path);
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Image not found",
                });
            }
        } catch (error) {
            console.error("Error getting profile image", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
};


module.exports = messageRoomsController;
