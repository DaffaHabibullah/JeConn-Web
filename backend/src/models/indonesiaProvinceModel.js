const mongoose = require("mongoose");

const indonesiaProvinceSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    id_province: {
        type: String,
        default: function() {
            return this._id;
        },
    },
    name: {
        type: String,
        required: true,
    },
});


module.exports = mongoose.model("indonesiaProvince", indonesiaProvinceSchema);
