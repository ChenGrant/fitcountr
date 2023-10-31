const User = require("../models/User");
const { RequestUtils, UserUtils } = require("../utils");

const getProfilePicture = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        const profilePictureURL = await UserUtils.getProfilePictureUrl(user);

        return res.json({ profilePictureURL });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserUtils.NO_USER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const getProfileData = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        const profileData = UserUtils.getProfileData(user);

        return res.json(profileData);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserUtils.NO_USER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const postProfileData = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        const newProfileData = req.body;

        await UserUtils.updateProfileData(user, newProfileData);

        return res.json({ message: "Profile data updated" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserUtils.NO_USER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const postProfilePicture = async (req, res) => {
    try {
        const { userUID } = req.params;
        const { profilePictureFile } = req.files;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        await UserUtils.updateUserProfilePicture(user, profilePictureFile);

        return res.json({ message: "Profile picture updated" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserUtils.NO_USER_MATCHED_ERROR_MESSAGE]:
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
