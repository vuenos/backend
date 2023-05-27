const express = require("express");
const cors = require("cors");
const colors = require("colors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/useRoutes");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.send("Running API server...");
});

const port = process.env.PORT || 5050;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(
    `Server running 🌏 is ${process.env.MODE_ENV} mode on PORT ${port} ⚓️`
      .yellow.bold,
  );
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connection Success!! 🚀".blue.bold))
  .catch((error) => {
    console.log("MongoDB Connection Fail: ".red.bold, error.message);
  });

// const figlet = require("figlet");
//
// figlet(
//   "platform",
//   {
//     horizontalLayout: "full",
//     verticalLayout: "default",
//   },
//   function (err, data) {
//     if (err) {
//       console.log("Something went wrong...");
//       console.dir(err);
//       return;
//     }
//     console.log(data);
//   },
// );
