const mongoose = require("mongoose");

const indonesiaProvinceSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});


module.exports = mongoose.model("indonesiaProvince", indonesiaProvinceSchema);
