const mongoose = require("mongoose");

const connectToDatabase = async () => {
    return new Promise((res, rej) => {
        mongoose
            .connect(process.env.MONGODB_ATLAS_URI)
            .then(() => {
                console.log("connected to mongodb atlas");
                res();
            })
            .catch((err) => {
                rej(err);
            });
    });
};

module.exports = { connectToDatabase };
