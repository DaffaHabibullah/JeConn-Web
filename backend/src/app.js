const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const db = require("./config");
const indonesiaProvinceData = require("./seeds/indonesiaProvinceData");
const entertainmentCategoriesData = require("./seeds/entertainmentCategoriesData");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const indonesiaProvinceRoute = require("./routes/indonesiaProvinceRoute");
const entertainmentRoute = require("./routes/entertainmentRoute");
const talentRoute = require("./routes/talentRoute");
const paymentTokenRoute = require("./routes/paymentTokenRoute");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

indonesiaProvinceData();
entertainmentCategoriesData();


app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.get("/public/images/:filename", (req, res) => {
    res.sendFile(__dirname + "/assets/images/" + req.params.filename);
});


app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/location", indonesiaProvinceRoute);
app.use("/entertainment-categories", entertainmentRoute);
app.use("/talent", talentRoute);
app.use("/payment", paymentTokenRoute);


module.exports = app;
