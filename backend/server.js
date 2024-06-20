require("dotenv").config();
const app = require("./src/app");
const http = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

app.set("socketio", io);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
