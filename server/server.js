require("./firebase/firebase");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// import middleware
const isAuthenticated = require("./middleware/isAuthenticated");
const {
  isAuthorized,
  ADMIN,
  PRIVATE,
  PUBLIC,
} = require("./middleware/isAuthorized");

// import routes
const firebaseClientConfigRoutes = require("./routes/firebaseClientConfigRoutes");
const signupRoutes = require("./routes/signupRoutes");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client/build")));
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/firebaseClientConfig", firebaseClientConfigRoutes);
app.use("/signup", isAuthenticated, isAuthorized(PRIVATE), signupRoutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/build/index.html"));
});

// mongoose and start server
console.log(`NODE_ENV=${config.NODE_ENV}`);
mongoose
  .connect(config.MONGODB_ATLAS_URI)
  .then(() => {
    console.log("connected to mongodb atlas");
    const LOCALHOST_PORT = 5000;
    const PORT = process.env.PORT || LOCALHOST_PORT;
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  })
  .catch((error) => console.log("failed to connect to mongodb atlas ", error));
