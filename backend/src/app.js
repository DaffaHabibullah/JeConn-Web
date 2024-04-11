const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const db = require("./config");
const entertainmentCategoriesData = require("./seeds/entertainmentCategoriesData");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

entertainmentCategoriesData();


app.get("/", (req, res) => {
    res.send("Server is running!");
});


module.exports = app;
