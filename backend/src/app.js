const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const db = require("./config");
const entertainmentCategoriesData = require("./seeds/entertainmentCategoriesData");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

entertainmentCategoriesData();


app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.get("/public/images/:filename", (req, res) => {
    res.sendFile(__dirname + "/assets/images/" + req.params.filename);
});


app.use("/auth", authRoute);
app.use("/user", userRoute);


module.exports = app;
