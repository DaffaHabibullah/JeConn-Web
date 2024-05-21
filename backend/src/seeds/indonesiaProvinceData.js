const indonesiaProvinceModel = require("../models/indonesiaProvinceModel");

const indonesiaProvinceData = [
    {
        _id: "1",
        name: "Nanggroe Aceh Darussalam",
    },
    {
        _id: "2",
        name: "Sumatera Utara",
    },
    {
        _id: "3",
        name: "Sumatera Barat",
    },
    {
        _id: "4",
        name: "Riau",
    },
    {
        _id: "5",
        name: "Jambi",
    },
    {
        _id: "6",
        name: "Sumatera Selatan",
    },
    {
        _id: "7",
        name: "Bengkulu",
    },
    {
        _id: "8",
        name: "Lampung",
    },
    {
        _id: "9",
        name: "Kepulauan Bangka Belitung",
    },
    {
        _id: "10",
        name: "Kepulauan Riau",
    },
    {
        _id: "11",
        name: "DKI Jakarta",
    },
    {
        _id: "12",
        name: "Jawa Barat",
    },
    {
        _id: "13",
        name: "Jawa Tengah",
    },
    {
        _id: "14",
        name: "DI Yogyakarta",
    },
    {
        _id: "15",
        name: "Jawa Timur",
    },
    {
        _id: "16",
        name: "Banten",
    },
    {
        _id: "17",
        name: "Bali",
    },
    {
        _id: "18",
        name: "Nusa Tenggara Barat",
    },
    {
        _id: "19",
        name: "Nusa Tenggara Timur",
    },
    {
        _id: "20",
        name: "Kalimantan Barat",
    },
    {
        _id: "21",
        name: "Kalimantan Tengah",
    },
    {
        _id: "22",
        name: "Kalimantan Selatan",
    },
    {
        _id: "23",
        name: "Kalimantan Timur",
    },
    {
        _id: "24",
        name: "Kalimantan Utara",
    },
    {
        _id: "25",
        name: "Sulawesi Utara",
    },
    {
        _id: "26",
        name: "Sulawesi Tengah",
    },
    {
        _id: "27",
        name: "Sulawesi Selatan",
    },
    {
        _id: "28",
        name: "Sulawesi Tenggara",
    },
    {
        _id: "29",
        name: "Gorontalo",
    },
    {
        _id: "30",
        name: "Sulawesi Barat",
    },
    {
        _id: "31",
        name: "Maluku",
    },
    {
        _id: "32",
        name: "Maluku Utara",
    },
    {
        _id: "33",
        name: "Papua Barat",
    },
    {
        _id: "34",
        name: "Papua",
    },
    {
        _id: "35",
        name: "Papua Tengah",
    },
    {
        _id: "36",
        name: "Papua Pegunungan",
    },
    {
        _id: "37",
        name: "Papua Selatan",
    },
    {
        _id: "38",
        name: "Papua Barat Daya",
    },
];

const createindonesianProvince = async () => {
    try {
        await indonesiaProvinceModel.create(indonesiaProvinceData);
        console.log("Indonesian province created successfully");
    } catch (error) {
        console.error("Error creating indonesian province", error);
    }
};


module.exports = createindonesianProvince;
