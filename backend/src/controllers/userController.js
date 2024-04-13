const userController = {
    async userProfile(req, res) {
        try {
            const user = req.user;
            return res.status(200).json({
                success: true,
                message: "User profile",
                data: {
                    user,
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
            const { fullName, dateOfBirth, gender, location, phoneNumber } = req.body;

            user.fullName = fullName;
            user.dateOfBirth = dateOfBirth;
            user.gender = gender;
            user.location = location;
            user.phoneNumber = phoneNumber;

            await user.save();

            return res.status(200).json({
                success: true,
                message: "User profile updated successfully",
                data: {
                    user,
                },
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
