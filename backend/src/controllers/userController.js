const userController = {
    async userProfile(req, res) {
        try {
            const user = req.user;
            return res.status(200).json({
                success: true,
                message: "User profile",
                data: {
                    username: user.username,
                    imageProfile: user.imageProfile,
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    dateOfBirth: user.dateOfBirth,
                    gender: user.gender,
                    address: user.address,
                    roles: user.roles,
                    messageRoom_id: user.messageRoom_id,
                },
            });
        } catch (error) {
            console.error("Error getting user profile", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    async updateUserProfile(req, res) {
        try {
            const user = req.user;
            const { fullName, dateOfBirth, gender, address, phoneNumber } = req.body;

            user.fullName = fullName;
            user.dateOfBirth = dateOfBirth;
            user.gender = gender;
            user.address = address;
            user.phoneNumber = phoneNumber;
            user.updatedAt = new Date();

            await user.save();

            return res.status(200).json({
                success: true,
                message: "User profile updated successfully",
            });
        } catch (error) {
            console.error("Error updating user profile", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
};


module.exports = userController;
