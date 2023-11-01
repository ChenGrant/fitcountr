const Progress = require("../models/Progress");
const User = require("../models/User");
const { RequestUtils, UserUtils, ProgressUtils } = require("../utils");

const getProgress = async (req, res) => {
    try {
        const { userUID } = req.params;
        
        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        const progress = await Progress.find({ userUID }).sort({ date: -1 });

        const clientFormattedProgress =
            ProgressUtils.formatProgressDocumentsForClient(progress);

        return res.json(clientFormattedProgress);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message);
    }
};

const postProgress = async (req, res) => {
    try {
        const { userUID } = req.params;
        const progress = req.body;

        const progressDocument = await Progress.create({
            ...progress,
            userUID,
        });

        const clientFormattedProgress =
            ProgressUtils.formatProgressDocumentForClient(progressDocument);

        return res.json(clientFormattedProgress);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message);
    }
};

const editProgress = async (req, res) => {
    try {
        const { progressID, progress } = req.body;

        let progressDocument = await Progress.findById(progressID);

        progressDocument = await ProgressUtils.updateProgressDocument(
            progressDocument,
            progress
        );

        const clientFormattedProgress =
            ProgressUtils.formatProgressDocumentForClient(progressDocument);

        return res.json(clientFormattedProgress);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message);
    }
};

const deleteProgress = async (req, res) => {
    try {
        const { progressID } = req.body;

        await Progress.findByIdAndDelete(progressID);

        return res.json({ message: "Progress deleted" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message);
    }
};

module.exports = {
    getProgress,
    postProgress,
    editProgress,
    deleteProgress,
};
