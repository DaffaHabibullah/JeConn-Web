const mongoose = require("mongoose");

const entertainmentCategoriesSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    id_entertainmentCategories: {
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


module.exports = mongoose.model("EntertainmentCategories", entertainmentCategoriesSchema);
