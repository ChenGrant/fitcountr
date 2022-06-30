const path = require("path");
const config = require("./config/config");
const cors = require("cors");
const morgan = require("morgan");
require("./firebase/firebase");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const isAuthenticated = require("./middleware/isAuthenticated");
const {
  isAuthorized,
  ADMIN,
  PRIVATE,
  PUBLIC,
} = require("./middleware/isAuthorized");
const firebaseClientConfigRoutes = require("./routes/firebaseClientConfigRoutes");
const signupRoutes = require("./routes/signupRoutes");

// -------------------------- MIDDLEWARE --------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client/build")));
app.use(cors());
app.use(morgan("dev"));

// ----------------------------- ROUTES -----------------------------
app.use("/firebaseClientConfig", firebaseClientConfigRoutes);
app.use("/signup", isAuthenticated, isAuthorized(PRIVATE), signupRoutes);
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/build/index.html"));
});

// connect to mongodb atlas, then start server
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
  .catch((error) => console.log("failed to connect to mongodb atlas ", error));
