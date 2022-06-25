const path = require("path");
const cors = require("cors");
const config = require("./config/config");
const express = require("express");
const app = express();
const firebaseClientConfigRoutes = require("./routes/firebaseClientConfigRoutes");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client/build")));
app.use(cors());

// routes

app.use("/firebaseclientconfig", firebaseClientConfigRoutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/build/index.html"));
});

const LOCALHOST_PORT = 5000;
const PORT = process.env.PORT || LOCALHOST_PORT;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
