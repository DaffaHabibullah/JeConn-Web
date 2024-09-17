const adminModel = require("../models/adminModel");

const adminAccountData = [
    {
        _id: "1",
        email: "admin@jeconn.site",
        password: "admin123",
    },
    {
        _id: "2",
        email: "manager@jeconn.site",
        password: "manager123",
    },
    {
        _id: "3",
        email: "developer@jeconn.site",
        password: "developer123",
    },
];

const createAdminAccount = async () => {
    try {
        await adminModel.create(adminAccountData);
        console.log("Admin account created successfully");
    } catch (error) {
        console.error("Error creating admin", error);
    }
};


module.exports = createAdminAccount;
