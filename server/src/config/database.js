const mongoose = require("mongoose");

const connectToDatabase = (app) => {
    console.log(process.env.MONGODB_ATLAS_URI)
    mongoose
        .connect(process.env.MONGODB_ATLAS_URI)
        .then(() => {
            console.log("connected to mongodb atlas");
            const PORT = process.env.PORT;
            app.listen(PORT, () => {
                console.log(`server started on port ${PORT}`);
            });
        })
        .catch((err) =>
            console.error("Failed to connect to MongoDB Atlas", err)
        );
};

module.exports = { connectToDatabase };
