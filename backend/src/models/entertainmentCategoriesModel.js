const mongoose = require("mongoose");

const entertainmentCategoriesSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});


module.exports = mongoose.model("EntertainmentCategories", entertainmentCategoriesSchema);
