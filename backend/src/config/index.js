require("dotenv").config();

const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URL;

mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection error: ", err);
    });

const db = mongoose.connection;


module.exports = db;
