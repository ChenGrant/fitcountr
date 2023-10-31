const path = require("path");
const config = require("./src/config/config");
const cors = require("cors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
require("./src/services/firebase/firebase");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const firebaseClientConfigRoutes = require("./src/routes/firebaseClientConfigRoutes");
const assetRoutes = require("./src/routes/assetRoutes");
const emailVerificationRoutes = require("./src/routes/emailVerificationRoutes");
const searchFoodRoutes = require("./src/routes/searchFoodRoutes");
const userRoutes = require("./src/routes/userRoutes");
const foodsRoutes = require("./src/routes/foodsRoutes");
const progressRoutes = require("./src/routes/progressRoutes");
const goalsRoutes = require("./src/routes/goalsRoutes");
const profileRoutes = require("./src/routes/profileRoutes");

// ------------------------------------ MIDDLEWARE ------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(cors());
app.use(fileupload());
app.use(morgan("dev"));

// -------------------------------------- ROUTES --------------------------------------
app.use("/firebaseClientConfig", firebaseClientConfigRoutes);
app.use("/asset", assetRoutes);
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

// ---------------------- MONGODB ATLAS CONNECTION, START SERVER ----------------------
console.log(`NODE_ENV=${config.NODE_ENV}`);
mongoose
    .connect(config.MONGODB_ATLAS_URI)
    .then(() => {
        console.log("connected to mongodb atlas");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        });
    })
    .catch((err) => console.log("failed to connect to mongodb atlas ", err));
