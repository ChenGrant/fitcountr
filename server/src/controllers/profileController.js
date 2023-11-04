const User = require("../models/User");
const UserService = require("../services/userService");
const { RequestUtils } = require("../utils");

const getProfilePicture = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserService.assertUserExists(user);

        const profilePictureURL = await UserService.getProfilePictureUrl(user);

        return res.json({ profilePictureURL });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserService.NO_USER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const getProfileData = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserService.assertUserExists(user);

        const profileData = UserService.getProfileData(user);

        return res.json(profileData);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserService.NO_USER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const postProfileData = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserService.assertUserExists(user);

        const newProfileData = req.body;

        await UserService.updateProfileData(user, newProfileData);

        return res.json({ message: "Profile data updated" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserService.NO_USER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const postProfilePicture = async (req, res) => {
    try {
        const { userUID } = req.params;
        const { profilePictureFile } = req.files;

        const user = await User.findUserByUserUID(userUID);

        await UserService.assertUserExists(user);

        await UserService.updateUserProfilePicture(user, profilePictureFile);

        return res.json({ message: "Profile picture updated" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserService.NO_USER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

module.exports = {
    getProfileData,
    getProfilePicture,
    postProfileData,
    postProfilePicture,
};
