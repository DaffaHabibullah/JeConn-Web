const entertainmentCategoriesModel = require("../models/entertainmentCategoriesModel");

const entertainmentCategoriesData = [
    {
        _id: "1",
        name: "Aktor",
    },
    {
        _id: "2",
        name: "Musisi",
    },
    {
        _id: "3",
        name: "Pelawak",
    },
    {
        _id: "4",
        name: "Cosplayer",
    },
    {
        _id: "5",
        name: "Penari",
    },
    {
        _id: "6",
        name: "Pesulap",
    },
    {
        _id: "7",
        name: "Penyanyi",
    },
    {
        _id: "8",
        name: "Model",
    },
    {
        _id: "9",
        name: "Badut",
    },
    {
        _id: "10",
        name: "Pembawa Acara",
    },
];

const createEntertainmentCategories = async () => {
    try {
        await entertainmentCategoriesModel.create(entertainmentCategoriesData);
        console.log("Entertainment categories created successfully");
    } catch (error) {
        console.error("Error creating entertainment categories", error);
    }
};


module.exports = createEntertainmentCategories;
