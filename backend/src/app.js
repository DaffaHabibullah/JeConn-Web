const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const db = require("./config");
const indonesiaProvinceData = require("./seeds/indonesiaProvinceData");
const entertainmentCategoriesData = require("./seeds/entertainmentCategoriesData");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const talentRoute = require("./routes/talentRoute");
const vacanciesRoute = require("./routes/vacanciesRoute");
const indonesiaProvinceRoute = require("./routes/indonesiaProvinceRoute");
const entertainmentRoute = require("./routes/entertainmentRoute");
const paymentTokenRoute = require("./routes/paymentTokenRoute");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

indonesiaProvinceData();
entertainmentCategoriesData();


app.get("/api", (req, res) => {
    res.send("Server is running!");
});

app.get("/api/public/images/:filename", (req, res) => {
    res.sendFile(__dirname + "/assets/images/" + req.params.filename);
});


app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/talent", talentRoute);
app.use("/api/vacancies", vacanciesRoute);
app.use("/api/location", indonesiaProvinceRoute);
app.use("/api/entertainment-categories", entertainmentRoute);
app.use("/api/payment", paymentTokenRoute);


module.exports = app;
