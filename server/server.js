const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const express = require("express");
const emailVerificationRoutes = require("./src/routes/emailVerificationRoutes");
const searchFoodRoutes = require("./src/routes/searchFoodRoutes");
const userRoutes = require("./src/routes/userRoutes");
const foodsRoutes = require("./src/routes/foodsRoutes");
const progressRoutes = require("./src/routes/progressRoutes");
const goalsRoutes = require("./src/routes/goalsRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const {
    loadEnvironmentVariables,
    initializeFirebaseAdminSDK,
    connectToDatabase,
} = require("./src/config");

const main = async (app) => {
    // config
    loadEnvironmentVariables();

    // third-party services
    initializeFirebaseAdminSDK();
    await connectToDatabase(app);

    // middleware
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "../client/build")));
    app.use(cors());
    app.use(fileupload());
    app.use(morgan("dev"));

    // routes
    app.use("/emailVerification", emailVerificationRoutes);
    app.use("/searchFood", searchFoodRoutes);
    app.use("/foods", foodsRoutes);
    app.use("/goals", goalsRoutes);
    app.use("/profile", profileRoutes);
    app.use("/progress", progressRoutes);
    app.use("/user", userRoutes);
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });

    // server
    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
};

const app = express();
main(app);
